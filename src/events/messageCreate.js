const { Message, Events } = require('discord.js');
const UserError = require('../classes/errors/user-error');
const activityTracker = require('../service/activity-tracker');
const repo = require('../data/repository');
const { forwardMessage } = require('../service/messaging');
const { isMod, isAdmin } = require('../util/discord-utils');
const embedShop = require('../util/embed-shop');
const { canExecute } = require('../util/utils');

module.exports = {
    eventName: Events.MessageCreate,
    /**
     * @param {Message} msg
     */
    execute: async msg => {
        // Ignore bot messages
        if (msg.author.bot) {
            return;
        }

        // Handle DMs
        if (!msg.guild) {
            console.log(`DM from ${msg.author.tag} [${msg.author.id}]: ${msg.content}`);

            forwardMessage(`**DM from <@${msg.author.id}>:**\n${msg.content}`, msg.client.application.owner, msg).catch(
                err => {
                    console.log(err.stack);
                }
            );

            return;
        }

        // Notify member message
        activityTracker.notifyActivity({id: msg.member.id, tag: msg.author.tag}, msg.guildId);

        let deleteMessage = false;

        const config = await repo.getGuildConfig(msg.guildId);

        // Handle Report Channels
        if (msg.channelId == config.reportsChannel) {
            try {
                const target = await msg.guild.channels.fetch(config.reportsTargetChannel);
                await forwardMessage(`**Report from <@${msg.author.id}>:**\n${msg.content}`, target, msg);
                deleteMessage = true;
            } catch (err) {
                console.log(err);
                msg.channel.send('Failed to send your report');
            }
        }

        if (msg.content.includes('discord.gg/') && !isAdmin(msg.member)) {
            deleteMessage = true;
            console.log(msg.author.id, msg.content);
        }

        if (!isMod(msg.member) && config.mediaOnlyChannels?.includes(msg.channelId) && msg.attachments.size == 0) {
            deleteMessage = true;
        }

        // Handle commands
        if (msg.content.startsWith(config.prefix)) {
            const commandName = msg.content.substring(config.prefix.length).trim().split(' ')[0].toLowerCase();

            const Command = msg.client.commands.get(commandName);

            if (!Command) {
                return;
            }

            if (canExecute(msg.member, Command.metadata.permissions)) {
                const args = msg.content
                    .substring(config.prefix.length)
                    .trim()
                    .substring(commandName.length)
                    .trimStart();

                const command = new Command(msg, args);

                await command.execute().catch(err => {
                    if (err instanceof UserError) {
                        msg.channel.send({
                            embeds: [embedShop.oneLineEmbed(err.message || 'Something went wrong', 'error')]
                        });
                    } else {
                        console.log(err.stack);
                    }
                });
            }
        }

        // Delete message if needed
        if (deleteMessage && msg.deletable) {
            await msg.delete().catch(err => console.log(err));
        }
    }
};

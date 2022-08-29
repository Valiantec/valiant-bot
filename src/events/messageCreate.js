const { Message, Events } = require('discord.js');
const UserError = require('../classes/errors/user-error');
const activityTracker = require('../service/activity-tracker');
const guildRepo = require('../data/repository/guild-repo');
const { forwardMessage, logModerationAction } = require('../service/messaging');
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
        activityTracker.notifyActivity(msg.member, msg.guildId);

        let deleteMessage = false;

        const config = await guildRepo.getConfig(msg.guildId);

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

        if (config.deleteInvites && msg.content.includes('discord.gg/') && !isAdmin(msg.member)) {
            deleteMessage = true;
            logModerationAction(msg, `Invite by ${msg.author} [${msg.author.id}] in <#${msg.channelId}> has been deleted.`);
        }

        if (!isMod(msg.member) && config.mediaOnlyChannels?.includes(msg.channelId) && msg.attachments.size == 0) {
            deleteMessage = true;
        }

        // Handle commands
        if (msg.content.startsWith(config.prefix)) {
            const commandName = msg.content.substring(config.prefix.length).trim().split(/\s/)[0].toLowerCase();

            const Command = msg.client.commands.get(commandName);

            if (!Command || !canExecute(msg.member, Command)) {
                return;
            }

            const args = msg.content.substring(config.prefix.length).trim().substring(commandName.length).trimStart();

            console.log(
                `[${Command.metadata.commandName}] used by ${msg.author.tag} (${msg.author.id}) in ${msg.guild.name} (${msg.guildId}). args: ${args}`
            );

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

        // Delete message if needed
        if (deleteMessage && msg.deletable) {
            await msg.delete().catch(err => console.log(err));
        }
    }
};

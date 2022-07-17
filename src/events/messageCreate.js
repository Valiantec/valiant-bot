const { Message } = require('discord.js');
const UserError = require('../classes/errors/user-error');
const { getConfig } = require('../managers/data-manager');
const { forwardMessage, isAdmin } = require('../util/discord-utils');
const embedShop = require('../util/embed-shop');
const { canExecute } = require('../util/utils');

module.exports = {
    eventName: 'messageCreate',
    /**
     * @param {Message} msg
     */
    execute: async msg => {
        // Ignore bot messages
        if (msg.author.bot) {
            return;
        }

        const guild = msg.guild;

        // Handle DMs
        if (!guild) {
            console.log(`DM from [${msg.author.id}]: ${msg.content}`);

            forwardMessage(
                `**DM from <@${msg.author.id}>:**\n${msg.content}`,
                msg,
                msg.client.application.owner
            ).catch(err => {
                console.log(err.stack);
            });

            return;
        }

        const config = await getConfig(msg.guildId);

        // Handle Report Channels
        if (msg.channelId == config.reportsChannel) {
            // && !isAdmin(msg.member)) {
            try {
                const target = await msg.guild.channels.fetch(
                    config.reportsTargetChannel
                );
                await forwardMessage(
                    `**Report from <@${msg.author.id}>:**\n${msg.content}`,
                    msg,
                    target
                );
                msg.delete().catch(err => console.log(err));
            } catch (err) {
                console.log(err);
                msg.channel.send('Failed to send your report');
            }
        }

        // Handle commands
        if (msg.content.startsWith(config.prefix)) {
            const commandName = msg.content
                .substring(config.prefix.length)
                .split(' ')[0]
                .toLowerCase();

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

                command.execute().catch(err => {
                    if (err instanceof UserError) {
                        msg.channel.send({
                            embeds: [
                                embedShop.oneLineEmbed(
                                    err.message || 'Something went wrong',
                                    'danger'
                                )
                            ]
                        });
                    } else {
                        console.log(err.stack);
                    }
                });
            }
        }
    }
};

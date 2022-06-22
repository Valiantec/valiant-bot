const UserError = require('../classes/errors/user-error');
const { getConfig } = require('../managers/data-manager');
const { forwardMessage } = require('../util/discord-utils');
const embedShop = require('../util/embed-shop');
const logger = require('../util/logger');
const { canExecute } = require('../util/utils');

module.exports = {
    eventName: 'messageCreate',
    execute: async msg => {
        // Ignore bot messages
        if (msg.author.bot) {
            return;
        }

        const guild = msg.guild;

        // Handle DMs
        if (!guild) {
            logger.log(`DM from [${msg.author.id}]: ${msg.content}`);
            forwardMessage(
                `**DM from <@${msg.author.id}>:**\n${msg.content}`,
                msg,
                msg.client.application.owner
            ).catch(err => {
                logger.log(err.stack);
            });
            return;
        }

        // TODO Handle Report Channels

        // Give points to member
        // let memberProfile = await getMemberProfile(msg.guildId, msg.member.id);
        // if (memberProfile) {
        //     memberProfile.points++;
        // } else {
        //     memberProfile = {
        //         id: msg.member.id,
        //         points: 1
        //     };
        // }
        // writeMemberProfile(msg.guildId, memberProfile);

        // Load guild config
        const config = await getConfig(msg.guildId);

        // Handle commands
        if (msg.content.startsWith(config.prefix)) {
            const commandName = msg.content
                .substring(config.prefix.length)
                .split(' ')[0]
                .toLowerCase();

            const commandClass = msg.client.commands.get(commandName);

            if (!commandClass) {
                return;
            }

            if (canExecute(msg.member, commandClass.metadata.permissions)) {
                const args = msg.content
                    .substring(config.prefix.length)
                    .trim()
                    .substring(commandName.length)
                    .trimStart();
                const command = new commandClass(msg, args);
                command.execute().catch(err => {
                    if (err instanceof UserError) {
                        msg.reply({
                            embeds: [
                                embedShop.oneLineEmbed(
                                    `${
                                        err.message
                                            ? err.message
                                            : 'Something went wrong'
                                    }`,
                                    'danger',
                                    null
                                )
                            ]
                        });
                    } else {
                        logger.log(err.stack);
                    }
                });
            }
        }
    }
};

const BaseCommand = require('../classes/base-command');
const { PermissionFlagsBits, codeBlock } = require('discord.js');
const embedShop = require('../util/embed-shop');
const guildRepo = require('../data/repository/guild-repo');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'config',
        description: 'Shows the server config or sets the value of a config item',
        syntax: '{prefix}config <key> <new-value>',
        examples: [
            '{prefix}config',
            '{prefix}config prefix $'
        ],
        permissions: PermissionFlagsBits.Administrator
    };

    async execute() {
        const args = this.parseArgs(1);

        const key = args[0];
        const value = args[1];

        const config = await guildRepo.getConfig(this.dMsg.guildId);

        let msg = null;

        if (Object.keys(config).includes(key) && value) {
            config[key] = value;
            await guildRepo.updateConfig(this.dMsg.guildId, config);
            msg = {
                embeds: [embedShop.oneLineEmbed(`Changed value of [\`${key}\`] to (\`${value}\`)`)]
            };
        } else {
            msg = `**Current Server Configurations:**${codeBlock(
                'json',
                JSON.stringify(
                    {
                        prefix: config.prefix,
                        reportsChannel: config.reportsChannel,
                        reportsTargetChannel: config.reportsTargetChannel,
                        logsChannel: config.logsChannel,
                        welcomeChannel: config.welcomeChannel,
                        welcomeMessage: config.welcomeMessage
                    },
                    null,
                    1
                )
            )}`;
        }

        await this.dMsg.channel.send(msg);
    }
}

module.exports = Command;

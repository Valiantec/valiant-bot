const BaseCommand = require('../classes/base-command');
const { Permissions } = require('discord.js');
const { getConfig, writeConfig } = require('../managers/data-manager');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'config',
        description: '',
        permissions: [Permissions.FLAGS.ADMINISTRATOR]
    };

    async execute() {
        const args = this.parseArgs(1);

        const key = args[0];
        const value = args[1];

        const config = await getConfig(this.dMsg.guildId);

        let msg = `**Current Server Configurations:**\n\`\`\`json\n${JSON.stringify(
            {
                prefix: config.prefix,
                reportsChannel: config.reportsChannel,
                reportsTargetChannel: config.reportsTargetChannel,
                welcomeChannel: config.welcomeChannel,
                welcomeMessage: config.welcomeMessage
            },
            null,
            4
        )}\n\`\`\``;

        if (Object.keys(config).includes(key)) {
            config[key] = value;
            await writeConfig(this.dMsg.guildId, config);
            msg = `Changed value of **${key}** to **${value}**\n${msg}`;
        }

        await this.dMsg.channel.send(msg);
    }
}

module.exports = Command;

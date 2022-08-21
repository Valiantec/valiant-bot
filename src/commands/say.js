const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const { tryForwardMessage } = require('../service/messaging');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'say',
        description: 'Makes the bot say something in the specified channel',
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(1);

        const channelId = args[0]?.replace(/[<#>]/g, '');
        const text = args[1];

        const channel = await this.dMsg.guild.channels.fetch(channelId);

        tryForwardMessage(text, channel, this.dMsg).then(() =>
            this.dMsg.channel.send(`✅ Message sent in <#${channelId}>`).catch(() => {})
        );
    }
}

module.exports = Command;

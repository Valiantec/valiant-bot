const { Permissions } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const { forwardMessage } = require('../util/discord-utils');

class SayCommand extends BaseCommand {
    static metadata = {
        commandName: 'say',
        description: 'Makes the bot say something in the specified channel',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const channelId = args[0];
        const text = args[1];

        const channel = await this.dMsg.guild.channels.fetch(channelId);

        forwardMessage(text, this.dMsg, channel)
            .then(() => this.dMsg.reply(`✅ Message sent in <#${channelId}>`))
            .catch(() =>
                this.dMsg.reply(`❌ Failed to send message in <#${channelId}>`)
            );
    }
}

module.exports = SayCommand;

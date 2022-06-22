const { Permissions } = require('discord.js');
const { forwardMessage } = require('../util/discord-utils');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');

class DmCommand extends BaseCommand {
    static metadata = {
        commandName: 'dm',
        description: 'Sends a message to a member',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        let x = 0;
        const args = this.parseArgs(1);

        const memberId = args[0];
        let text = args[1];

        let member = null;
        try {
            member = await this.dMsg.guild.members.fetch(memberId);
        } catch (error) {
            throw new UserError(`Could not dm <@${memberId}> ❌`);
        }

        text = `You received a message from **${this.dMsg.guild.name}**:\n${text}`;

        return forwardMessage(text, this.dMsg, member)
            .then(() => this.dMsg.reply(`✅ DM sent to ${member}`))
            .catch(() => this.dMsg.reply(`❌ Failed to send DM to ${member}`));
    }
}

module.exports = DmCommand;

const { Permissions } = require('discord.js');
const { forwardMessage } = require('../util/discord-utils');
const BaseCommand = require('../classes/base-command');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'dm',
        description: 'Sends a message to a member',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0];
        const text = `You received a message from **${this.dMsg.guild.name}**:\n${args[1]}`;

        memberIds.split(SEPARATOR).forEach(async memberId => {
            try {
                const member = await this.dMsg.guild.members.fetch(memberId);
                await forwardMessage(text, this.dMsg, member);
                this.dMsg.channel
                    .send(`✅ DM sent to <@${memberId}>`)
                    .catch(err => console.log(err));
            } catch (err) {
                console.log(err);
                this.dMsg.channel
                    .send(`❌ Failed to DM <@${memberId}>`)
                    .catch(err => console.log(err));
            }
        });
    }
}

module.exports = Command;

const { GuildMember, PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const { forwardMessage } = require('../service/messaging');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'dm',
        aliases: ['msg'],
        description: 'Sends a message to a member',
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0]?.replace(/[<@>]/g, '');
        const text = `You received a message from **${this.dMsg.guild?.name}**:\n${args[1]}`;

        memberIds.split(SEPARATOR).forEach(async memberId => {
            try {
                const member = await this.dMsg.guild?.members.fetch(memberId);
                await forwardMessage(text, member, this.dMsg);
                this.dMsg.channel.send(`✅ DM sent to <@${memberId}>`).catch(err => console.log(err));
            } catch (err) {
                console.log(err);
                this.dMsg.channel.send(`❌ Failed to DM <@${memberId}>`).catch(err => console.log(err));
            }
        });
    }
}

module.exports = Command;

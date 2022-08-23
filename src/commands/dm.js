const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const { tryForwardMessage } = require('../service/messaging');
const { tryFetchMember } = require('../util/discord-utils');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'dm',
        aliases: ['msg'],
        description: 'Sends a message to a member',
        syntax: '{prefix}dm <memberIDs> <text>',
        examples: ['{prefix}dm 123123123 Test Message', '{prefix}dm 123123123,456456456 Test Message'],
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0]?.replace(/[<@>]/g, '');
        const text = `You received a message from **${this.dMsg.guild?.name}**:\n${args[1]}`;

        memberIds.split(SEPARATOR).forEach(async memberId => {
            tryFetchMember(this.dMsg.guild, memberId).then(member => {
                if (!member) return;
                tryForwardMessage(text, member, this.dMsg).then(() => {
                    this.dMsg.channel.send(`✅ DM sent to <@${memberId}>`).catch(err => console.log(err));
                });
            });
        });
    }
}

module.exports = Command;

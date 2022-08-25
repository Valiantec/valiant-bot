const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const memberRepo = require('../data/repository/member-repo');
const { tryFetchMember } = require('../util/discord-utils');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'clearrecord',
        description: "Clears a member's record (notes, warnings, timeouts, and bans)",
        syntax: '{prefix}clearrecord <memberID>',
        examples: ['{prefix}clearrecord 123123123'],
        permissions: PermissionFlagsBits.Administrator
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0]?.replace(/[<@>]/g, '');

        const member = await tryFetchMember(this.dMsg.guild, memberId);

        const profile = await memberRepo.getById(this.dMsg.guildId, memberId, member != null);

        if (profile) {
            delete profile.record;
            await memberRepo.update(this.dMsg.guildId, profile);
        }

        await this.dMsg.channel.send(`✅ Record cleared : <@${memberId}>`);
    }
}

module.exports = Command;

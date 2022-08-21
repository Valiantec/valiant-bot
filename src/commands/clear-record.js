const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const repo = require('../data/repository');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'clearrecord',
        description: "Clears a member's record (notes, warnings, timeouts, and bans)",
        permissions: PermissionFlagsBits.Administrator
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0]?.replace(/[<@>]/g, '');

        const member = await this.dMsg.guild?.members.fetch(memberId);

        const profile = await repo.getMemberProfile(this.dMsg.guildId, memberId, member != null);

        if (profile) {
            delete profile.record;
            await repo.updateMemberProfile(this.dMsg.guildId, profile);
        }

        await this.dMsg.channel.send(`✅ Record cleared : <@${memberId}>`);
    }
}

module.exports = Command;

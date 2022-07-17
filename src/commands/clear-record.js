const { Permissions } = require('discord.js');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');
const BaseCommand = require('../classes/base-command');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'clearrecord',
        description:
            "Clears a member's record (notes, warnings, timeouts, and bans)",
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0];

        const memberProfile = await getMemberProfile(
            this.dMsg.guildId,
            memberId
        );

        delete memberProfile.record;

        writeMemberProfile(this.dMsg.guildId, memberProfile);

        this.dMsg.channel.send(`<@${memberId}>: Record cleared ✅`);
    }
}

module.exports = Command;

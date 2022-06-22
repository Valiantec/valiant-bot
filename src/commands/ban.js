const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { Permissions } = require('discord.js');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');

class BanCommand extends BaseCommand {
    static metadata = {
        commandName: 'ban',
        description: 'Bans a member and adds it to their profile',
        permissions: [Permissions.FLAGS.ADMINISTRATOR]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0];
        const reason = args[1];

        if (!reason) {
            throw new UserError(
                "You can't ban a member without providing a reason"
            );
        }

        let member = null;
        try {
            member = await this.dMsg.guild.members.fetch(memberId);
        } catch (error) {}

        if (
            member &&
            (member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
                member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
        ) {
            throw new UserError("You can't ban this member");
        }

        this.dMsg.guild.bans
            .create(memberId, { days: 7, reason: reason })
            .then(async () => {
                const memberProfile = await getMemberProfile(
                    this.dMsg.guildId,
                    memberId
                );

                if (!memberProfile.record) {
                    memberProfile.record = {};
                }

                if (!memberProfile.record.bans) {
                    memberProfile.record.bans = [];
                }

                memberProfile.record.bans.push({
                    by: this.dMsg.author.tag,
                    text: reason,
                    date: new Date().toISOString()
                });

                writeMemberProfile(this.dMsg.guildId, memberProfile);

                this.dMsg.reply(`<@${memberId}>: Banned ✅`);
            })
            .catch(() => this.dMsg.reply(`<@${memberId}>: Failed to ban ❌`));
    }
}

module.exports = BanCommand;

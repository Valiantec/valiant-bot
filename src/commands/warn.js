const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { Permissions } = require('discord.js');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');

class WarnCommand extends BaseCommand {
    static metadata = {
        commandName: 'warn',
        description: 'Sends a warning to a member and adds it to their profile',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0];
        const reason = args[1];

        if (!reason) {
            throw new UserError(
                "You can't warn a member without providing a reason"
            );
        }

        let member = null;
        try {
            member = await this.dMsg.guild.members.fetch(memberId);
        } catch (error) {
            throw new UserError(
                `Could not find <@${memberId}> ❌`
            );
        }

        if (
            member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
            member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
        ) {
            throw new UserError("You can't warn this member");
        }

        const memberProfile = await getMemberProfile(
            this.dMsg.guildId,
            memberId
        );

        if (!memberProfile.record) {
            memberProfile.record = {};
        }

        if (!memberProfile.record.warnings) {
            memberProfile.record.warnings = [];
        }

        memberProfile.record.warnings.push({
            by: this.dMsg.author.tag,
            text: reason,
            date: new Date().toISOString()
        });

        memberProfile.tag = member.user.tag;

        writeMemberProfile(this.dMsg.guildId, memberProfile);

        member
            .send(
                `You received a warning from **${this.dMsg.guild.name}**:\n${reason}`
            )
            .then(() => this.dMsg.reply(`${member}: Warned ✅`))
            .catch(() => {
                this.dMsg.reply(
                    `${member}: Warning logged, but failed to DM ⚠`
                );
            });
    }
}

module.exports = WarnCommand;

const { Permissions } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');
const InvalidArgumentsError = require('../classes/errors/invalid-arguments-error');

class TimeoutCommand extends BaseCommand {
    static metadata = {
        commandName: 'timeout',
        description: 'Timeout a member and add it to their profile',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(2);

        const memberId = args[0];
        let duration = 0;
        try {
            duration = parseInt(args[1]) * 60 * 1000;
        } catch (error) {
            throw new InvalidArgumentsError();
        }
        const reason = args[2];

        if (!reason && duration > 0) {
            throw new UserError(
                "You can't timeout a member without providing a reason"
            );
        }

        const member = await this.dMsg.guild.members.fetch(memberId);

        if (
            member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
            member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
        ) {
            throw new UserError("You can't timeout this member");
        }

        member.timeout(duration, reason).then(async () => {
            let reply = '';
            if (duration > 0) {
                reply = `${member}: Timed out for ${duration} minutes ✅`;

                const memberProfile = await getMemberProfile(
                    this.dMsg.guildId,
                    memberId
                );

                if (!memberProfile.record) {
                    memberProfile.record = {};
                }

                if (!memberProfile.record.timeouts) {
                    memberProfile.record.timeouts = [];
                }

                memberProfile.record.timeouts.push({
                    by: this.dMsg.author.tag,
                    text: reason,
                    duration: duration * 60 * 1000,
                    date: new Date().toISOString()
                });

                memberProfile.tag = member.user.tag;

                writeMemberProfile(this.dMsg.guildId, memberProfile);

                try {
                    await member.send(
                        `You received a timeout in **${this.dMsg.guild.name}**:\n${reason}`
                    );
                } catch (err) {
                    reply += ', but failed to DM ⚠';
                }
            } else {
                reply = `${member}: Timeout removed ✅`;

                try {
                    await member.send(
                        `Your timeout in **${this.dMsg.guild.name}** has been removed`
                    );
                } catch (err) {
                    reply += ', but failed to DM ⚠';
                }
            }
            this.dMsg.reply(reply);
        });
    }
}

module.exports = TimeoutCommand;

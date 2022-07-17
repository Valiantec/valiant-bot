const { Permissions } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');
const InvalidArgumentsError = require('../classes/errors/invalid-arguments-error');
const { isMod } = require('../util/discord-utils');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'timeout',
        description:
            'Timeout a member for x minutes and add it to their profile (DMs the reason to the member)',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(2);

        const memberIds = args[0];
        let duration = 0;
        try {
            duration = parseInt(args[1]);
        } catch (error) {
            throw new InvalidArgumentsError();
        }
        const reason = args[2];

        if (!reason && duration > 0) {
            throw new UserError(
                "You can't timeout a member without providing a reason"
            );
        }

        memberIds.split(SEPARATOR).forEach(async memberId => {
            const member = await this.dMsg.guild.members.fetch(memberId);

            if (member && isMod(member)) {
                this.dMsg.channel
                    .send(`<@${memberId}>: Failed to timeout ❌`)
                    .catch(err => console.log(err));
                return;
            }

            member
                ?.timeout(duration * 60 * 1000, reason)
                .then(async () => {
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
                            duration: duration,
                            date: new Date().toISOString()
                        });

                        memberProfile.tag = member.user.tag;

                        await writeMemberProfile(
                            this.dMsg.guildId,
                            memberProfile
                        ).catch(err => {
                            console.log(err);
                            reply += '\nFailed to update profile';
                        });

                        try {
                            await member.send(
                                `You received a timeout in **${this.dMsg.guild.name}**:\n${reason}`
                            );
                        } catch (err) {
                            reply += '\nFailed to DM ⚠';
                        }
                    } else {
                        reply = `<@${memberId}>: Timeout removed ✅`;

                        try {
                            await member.send(
                                `Your timeout in **${this.dMsg.guild.name}** has been removed`
                            );
                        } catch (err) {
                            reply += '\nFailed to DM ⚠';
                        }
                    }
                    this.dMsg.channel.send(reply).catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        });
    }
}

module.exports = Command;

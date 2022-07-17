const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');
const { isMod } = require('../util/discord-utils');
const { PermissionFlagsBits } = require('discord-api-types/v10');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'ban',
        description: 'Bans a member and adds it to their profile',
        permissions: PermissionFlagsBits.Administrator
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0];
        const reason = args[1];

        if (!reason) {
            throw new UserError(
                "You can't ban a member without providing a reason"
            );
        }

        memberIds.split(SEPARATOR).forEach(async memberId => {
            try {
                const member = await this.dMsg.guild.members
                    .fetch(memberId)
                    .catch(() => {});

                if (member && isMod(member)) {
                    this.dMsg.channel
                        .send(`<@${memberId}>: Failed to ban ❌`)
                        .catch(err => console.log(err));
                    return;
                }

                await this.dMsg.guild.bans.create(memberId, {
                    days: 7,
                    reason: reason
                });

                this.dMsg.channel
                    .send(`<@${memberId}>: Banned ✅`)
                    .catch(err => console.log(err));

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

                await writeMemberProfile(this.dMsg.guildId, memberProfile);
            } catch (err) {
                console.log(err);
                this.dMsg.channel
                    .send(`<@${memberId}>: Something went wrong ❌`)
                    .catch(err => console.log(err));
            }
        });
    }
}

module.exports = Command;

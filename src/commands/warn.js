const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { Permissions } = require('discord.js');
const dataManager = require('../managers/data-manager');
const { isMod } = require('../util/discord-utils');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'warn',
        description: 'Sends a warning to a member and adds it to their profile',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0];
        const reason = args[1];

        if (!reason) {
            throw new UserError(
                "You can't warn a member without providing a reason"
            );
        }

        memberIds.split(SEPARATOR).forEach(async memberId => {
            let member = null;
            try {
                member = await this.dMsg.guild.members.fetch(memberId);
            } catch (error) {
                this.dMsg.channel
                    .send(`Could not find <@${memberId}> ❌`)
                    .catch(err => cnosole.log(err));
                return;
            }

            if (member && isMod(member)) {
                this.dMsg.channel
                    .send(`<@${memberId}>: Failed to warn ❌`)
                    .catch(err => console.log(err));
                return;
            }

            const memberProfile = await dataManager.getMemberProfile(
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

            dataManager
                .writeMemberProfile(this.dMsg.guildId, memberProfile)
                .catch(err => {
                    console.log(err);
                    this.dMsg.channel.send(
                        `<@${memberId}>: Failed to add warning to profile`
                    );
                });

            member
                .send(
                    `You received a warning from **${this.dMsg.guild.name}**:\n${reason}`
                )
                .then(() => this.dMsg.channel.send(`<@${memberId}>: Warned ✅`))
                .catch(() => {
                    this.dMsg.channel.send(`<@${memberId}>: Failed to DM ⚠`);
                });
        });
    }
}

module.exports = Command;

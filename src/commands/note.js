const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { Permissions } = require('discord.js');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');

const SEPARATOR = ',';

class Command extends BaseCommand {
    static metadata = {
        commandName: 'note',
        description: "Puts a note on a member's profile",
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0];
        const note = args[1];

        if (!note) {
            throw new UserError(
                "You can't add an empty note to a member's profile"
            );
        }

        memberIds.split(SEPARATOR).forEach(async memberId => {
            try {
                const memberProfile = await getMemberProfile(
                    this.dMsg.guildId,
                    memberId
                );

                if (!memberProfile.record) {
                    memberProfile.record = {};
                }

                if (!memberProfile.record.notes) {
                    memberProfile.record.notes = [];
                }

                memberProfile.record.notes.push({
                    by: this.dMsg.author.tag,
                    text: note,
                    date: new Date().toISOString()
                });

                await writeMemberProfile(this.dMsg.guildId, memberProfile);
                this.dMsg.channel
                    .send(`<@${memberId}>: Notes updated ✅`)
                    .catch(err => console.log(err));
            } catch (err) {
                console.log(err);
                this.dMsg.channel
                    .send(`<@${memberId}>: Failed to update notes ❌`)
                    .catch(err => console.log(err));
            }
        });
    }
}

module.exports = Command;

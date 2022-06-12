const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { Permissions } = require('discord.js');
const {
    getMemberProfile,
    writeMemberProfile
} = require('../managers/data-manager');

class NoteCommand extends BaseCommand {
    static metadata = {
        commandName: 'note',
        description: "Puts a note on a member's profile",
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0];
        const note = args[1];

        if (!note) {
            throw new UserError(
                "You can't add an empty note to a member's profile"
            );
        }

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


        writeMemberProfile(this.dMsg.guildId, memberProfile)
            .then(() => this.dMsg.reply(`<@${memberId}>: Notes updated ✅`))
            .catch(() =>
                this.dMsg.reply(`<@${memberId}>: Failed to update notes ❌`)
            );
    }
}

module.exports = NoteCommand;

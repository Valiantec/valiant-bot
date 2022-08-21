const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const moderation = require('../service/moderation');
const InvalidArgumentsError = require('../classes/errors/invalid-arguments-error');
const { multiIDStringToList } = require('../util/str-utils');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'timeout',
        aliases: ['mute'],
        description:
            'Timeout a member for x minutes and add it to their profile (DMs the reason to the member)',
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(2);

        const memberIds = args[0]?.replace(/[<@>]/g, '');
        let duration = 0;
        duration = parseInt(args[1]);

        if (!duration && args[1] !== '0') {
            throw new InvalidArgumentsError();
        }

        const text = args[2];

        if (!text && duration > 0) {
            throw new UserError(
                "You can't timeout a member without providing a reason"
            );
        }

        multiIDStringToList(memberIds).forEach(async memberId => {
            try {
                if (duration > 0) {
                    await moderation.doTimeout(
                        this.dMsg,
                        memberId,
                        duration,
                        text
                    );
                    this.dMsg.channel
                        .send(
                            `✅ Timed out for ${duration} minutes : <@${memberId}>`
                        )
                        .catch(err => console.log(err));
                } else {
                    await moderation.removeTimeout(this.dMsg, memberId);
                    this.dMsg.channel
                        .send(`✅ Timeout removed : <@${memberId}>`)
                        .catch(err => console.log(err));
                }
            } catch (e) {
                console.log(e);
                this.dMsg.channel
                    .send(`❌ Failed to update timeout : <@${memberId}>`)
                    .catch(err => console.log(err));
            }
        });
    }
}

module.exports = Command;

const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { PermissionFlagsBits } = require('discord.js');
const moderation = require('../service/moderation');
const { multiIDStringToList } = require('../util/str-utils');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'warn',
        description: 'Sends a warning to a member and adds it to their profile',
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberIds = args[0]?.replace(/[<@>]/g, '');
        const text = args[1];

        if (!text) {
            throw new UserError(
                "You can't warn a member without providing a reason"
            );
        }

        multiIDStringToList(memberIds).forEach(async memberId => {
            try {
                await moderation.doWarn(this.dMsg, memberId, text);

                this.dMsg.channel
                    .send(`✅ Warned : <@${memberId}>`)
                    .catch(err => console.log(err));
            } catch (e) {
                console.log(e);
                this.dMsg.channel
                    .send(`❌ Failed to warn <@${memberId}>`)
                    .catch(err => console.log(err));
            }
        });
    }
}

module.exports = Command;

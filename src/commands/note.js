const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const moderation = require('../service/moderation');
const { multiIDStringToList } = require('../util/str-utils');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'note',
    description: "Puts a note on a member's profile",
    permissions: PermissionFlagsBits.ManageMessages
  };

  async execute() {
    const args = this.parseArgs(1);

    const providedIds = args[0]?.replace(/[<@>]/g, '');
    const text = args[1];

    if (!text) {
      throw new UserError("You can't add an empty note");
    }

    multiIDStringToList(providedIds).forEach(async memberId => {
      try {
        await moderation.doNote(this.dMsg, memberId, text);
        this.dMsg.channel.send(`✅ Notes updated : <@${memberId}>`).catch(err => console.log(err));
      } catch (err) {
        this.dMsg.channel.send(`❌ Failed to update notes : <@${memberId}>`).catch(err => console.log(err));
      }
    });
  }
}

module.exports = Command;

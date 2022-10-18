const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const moderation = require('../service/moderation');
const { oneLineEmbed } = require('../util/embed-shop');
const { multiIDStringToList } = require('../util/str-utils');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'kick',
    description: 'Kicks a member from the server',
    syntax: '{prefix}kick <memberIDs> <reason>',
    examples: ['{prefix}kick 123123123 Inappropriate name', '{prefix}kick 123123123,456456456 Suspected raid'],
    permissions: PermissionFlagsBits.ManageMessages
  };

  async execute() {
    const args = this.parseArgs(1);

    const memberIds = args[0]?.replace(/[<@>]/g, '');
    const text = args[1];

    if (!text) {
      throw new UserError("You can't kick a member without providing a reason");
    }

    multiIDStringToList(memberIds).forEach(async memberId => {
      try {
        await moderation.doKick(this.dMsg, memberId, text);
        this.dMsg.channel.send(`✅ Kicked <@${memberId}>`).catch(err => console.log(err));
      } catch (e) {
        console.log(e);
        this.dMsg.channel.send({embeds:[oneLineEmbed(e.message, 'error')]}).catch(err => console.log(err));
      }
    });
  }
}

module.exports = Command;

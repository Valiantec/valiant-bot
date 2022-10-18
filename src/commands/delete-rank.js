const guildRepo = require('../data/repository/guild-repo');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { oneLineEmbed } = require('../util/embed-shop');
const { PermissionFlagsBits } = require('discord.js');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'deleterank',
    aliases: ['removerank', 'dr'],
    description: 'Delete a rank and optionally delete the role associated with it',
    syntax: '{prefix}deleterank <role-id> <optional-delete-role>',
    examples: ['{prefix}deleterank 123123123', '{prefix}deleterank 123123123 delete-role'],
    permissions: PermissionFlagsBits.Administrator
  };

  async execute() {
    const args = this.parseArgs(2);

    const roleId = args[0].replace(/[<@&>]/g, '');
    const deleteRole = args[1]?.toLowerCase() === 'delete-role';

    const role = await this.dMsg.guild.roles.fetch(roleId);

    if (!role) {
      throw new UserError(`${roleId} is not a role`);
    }

    const config = await guildRepo.getConfig(this.dMsg.guildId);

    config.ranking.rankList = config.ranking.rankList.filter(r => r.roleId != roleId);

    await guildRepo.updateConfig(this.dMsg.guildId, config);

    if (deleteRole && role.editable) {
      await role.delete('Rank deleted');
    }

    await this.dMsg.channel.send({
      embeds: [oneLineEmbed(`Rank ${deleteRole ? `and role **${role.name}**` : role} deleted`, 'success')]
    });
  }
}

module.exports = Command;

const guildRepo = require('../data/repository/guild-repo');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const InvalidArgumentsError = require('../classes/errors/invalid-arguments-error');
const { oneLineEmbed } = require('../util/embed-shop');
const { PermissionFlagsBits } = require('discord.js');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'createrank',
    aliases: ['addrank', 'cr'],
    description: 'Create a rank (role) that will be assigned to members when they reach a certain number of points',
    syntax: '{prefix}createrank <role-id> <point-threshold>',
    permissions: PermissionFlagsBits.Administrator
  };

  async execute() {
    const args = this.parseArgs(2);

    const roleId = args[0].replace(/[<@&>]/g, '');
    const threshold = parseInt(args[1]);

    if (isNaN(threshold)) {
      throw new InvalidArgumentsError();
    }

    const role = await this.dMsg.guild.roles.fetch(roleId);

    if (!role) {
      throw new UserError(`${roleId} is not a role`);
    }

    const config = await guildRepo.getConfig(this.dMsg.guildId);

    config.ranking.rankList = config.ranking.rankList.filter(r => r.roleId != roleId);

    config.ranking.rankList.push({ roleId, threshold });

    await guildRepo.updateConfig(this.dMsg.guildId, config);

    await this.dMsg.channel.send({
      embeds: [oneLineEmbed(`Rank ${role} created with threshold \`${threshold}\``, 'success')]
    });
  }
}

module.exports = Command;

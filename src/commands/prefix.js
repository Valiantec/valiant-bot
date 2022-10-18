const BaseCommand = require('../classes/base-command');
const { oneLineEmbed } = require('../util/embed-shop');
const guildRepo = require('../data/repository/guild-repo');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'prefix',
    description: 'Shows the command prefix for this server'
  };

  async execute() {
    const config = await guildRepo.getConfig(this.dMsg.guildId);

    await this.dMsg.channel.send({
      embeds: [oneLineEmbed(`The prefix for this server is: \`${config.prefix}\``)]
    });
  }
}

module.exports = Command;

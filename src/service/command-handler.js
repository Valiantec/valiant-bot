const UserError = require('../classes/errors/user-error');
const embedShop = require('../util/embed-shop');
const { canExecute } = require('../util/utils');

module.exports = {
  handleCommand: async (msg, config) => {
    const commandName = msg.content.substring(config.prefix.length).trim().split(/\s/)[0].toLowerCase();

    const Command = msg.client.commands.get(commandName);

    if (!Command || !canExecute(msg.member, Command)) {
      return;
    }

    const args = msg.content.substring(config.prefix.length).trim().substring(commandName.length).trimStart();

    const command = new Command(msg, args);

    console.log(
      `[${Command.metadata.commandName}] used by (${msg.author.tag}) [${msg.author.id}] in (${msg.guild.name}) [${
        msg.guildId
      }]${args ? ', args: ' + args : ''}`
    );

    await command.execute().catch(err => {
      if (err instanceof UserError) {
        msg.channel.send({
          embeds: [embedShop.oneLineEmbed(err.message || 'Something went wrong', 'error')]
        });
      } else {
        msg.channel.send({
          embeds: [embedShop.oneLineEmbed('Something went wrong', 'error')]
        });
        console.log(err);
      }
    });
  }
};

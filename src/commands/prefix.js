const BaseCommand = require('../classes/base-command');
const { oneLineEmbed } = require('../util/embed-shop');
const repo = require('../data/repository');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'prefix',
        description: 'Shows the command prefix for this server'
    };

    async execute() {
        const prefix = (await repo.getGuildConfig(this.dMsg.guild.id)).prefix;

        const embed = oneLineEmbed(
            `The prefix for this server is: \`${prefix}\``
        );

        await this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

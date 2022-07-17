const BaseCommand = require('../classes/base-command');
const { getConfig } = require('../managers/data-manager');
const { oneLineEmbed } = require('../util/embed-shop');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'prefix',
        description: 'Shows the command prefix for this server'
    };

    async execute() {
        const prefix = (await getConfig(this.dMsg.guild.id)).prefix;

        const embed = oneLineEmbed(
            `The prefix for this server is: \`${prefix}\``
        );

        await this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

const BaseCommand = require('../classes/base-command');
const { getConfig } = require('../managers/data-manager');
const { oneLineEmbed } = require('../util/embed-shop');

class PrefixCommand extends BaseCommand {

    static metadata = {
        commandName: 'prefix'
    };

    async execute() {

        const prefix = (await getConfig(this.dMsg.guild.id)).prefix;

        const embed = oneLineEmbed(
            `The prefix for this server is: \`${prefix}\``
        );
        
        await this.dMsg.reply({ embeds: [embed] });
    }
}

module.exports = PrefixCommand;

const { Permissions } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const InvalidArgumentsError = require('../classes/errors/invalid-arguments-error');
const { oneLineEmbed } = require('../util/embed-shop');
const { getConfig, writeConfig } = require('../managers/data-manager');

class SetPrefixCommand extends BaseCommand {
    static metadata = {
        commandName: 'setprefix',
        permissions: [Permissions.FLAGS.ADMINISTRATOR]
    };

    async execute() {
        const args = this.parseArgs(1);

        if (args.length == 0 || args[0].length < 1) {
            throw new InvalidArgumentsError();
        }

        const newPrefix = args[0];

        const config = await getConfig(this.dMsg.guild.id);

        config.prefix = newPrefix;
        await writeConfig(this.dMsg.guild.id, config);

        const embed = oneLineEmbed(`Prefix changed to \`${config.prefix}\``);

        await this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = SetPrefixCommand;

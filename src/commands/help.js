const fs = require('fs');
const BaseCommand = require('../classes/base-command');
const { getGuildConfig } = require('../data/repository');
const {
    singleCommandHelpEmbed,
    helpCommandEmbed
} = require('../util/embed-shop');
const { canExecute } = require('../util/utils');

const commandsMetadata = new Map();

class Command extends BaseCommand {
    static metadata = {
        commandName: 'help',
        aliases: ['h'],
        description:
            'Shows commands available to the person who initiated the command'
    };

    async execute() {
        const args = this.parseArgs(1);

        const commandName = args[0];

        let embed;

        if (commandName) {
            const config = await getGuildConfig(this.dMsg.guildId);
            const metadata = commandsMetadata.get(commandName);
            if (!canExecute(this.dMsg.member, metadata.permissions)) {
                return;
            }
            embed = singleCommandHelpEmbed(metadata, config.prefix);
        } else {
            const authorizedCommandsMetaData = [];
            commandsMetadata.forEach(v => {
                if (canExecute(this.dMsg.member, v.permissions)) {
                    authorizedCommandsMetaData.push(v);
                }
            });
            embed = helpCommandEmbed(authorizedCommandsMetaData);
        }

        this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

fs.readdirSync('./src/commands/')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        try {
            const commandClass = require(`./${fileName}`);
            commandsMetadata.set(
                commandClass.metadata.commandName,
                commandClass.metadata
            );
        } catch (err) {
            console.log(`❌ help.js: [Error constructing help for ${fileName}]`);
        }
    });

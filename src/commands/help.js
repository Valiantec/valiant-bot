const fs = require('fs');
const BaseCommand = require('../classes/base-command');
const {
    singleCommandHelpEmbed,
    helpCommandEmbed
} = require('../util/embed-shop');
const { canExecute } = require('../util/utils');

const commandsMetadata = new Map();

class HelpCommand extends BaseCommand {
    static metadata = {
        commandName: 'help',
        description:
            'Shows commands available to the person who initiated the command'
    };

    async execute() {
        const args = this.parseArgs(1);

        const commandName = args[0];

        let embed;

        if (commandName) {
            const metadata = commandsMetadata.get(commandName);
            if (!canExecute(this.dMsg.member, metadata.permissions)) {
                return;
            }
            embed = singleCommandHelpEmbed(metadata);
        } else {
            const authorizedCommandsMetaData = [];
            commandsMetadata.forEach((v, k) => {
                if (canExecute(this.dMsg.member, v.permissions)) {
                    authorizedCommandsMetaData.push(v);
                }
            });
            embed = helpCommandEmbed(authorizedCommandsMetaData);
        }

        this.dMsg.reply({ embeds: [embed] });
    }
}

module.exports = HelpCommand;

fs.readdirSync('./src/commands/')
    .filter(fileName => fileName.endsWith('.js'))
    .forEach(fileName => {
        const commandClass = require(`./${fileName}`);
        commandsMetadata.set(
            commandClass.metadata.commandName,
            commandClass.metadata
        );
    });

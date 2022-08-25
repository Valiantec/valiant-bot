const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const BaseCommand = require('../classes/base-command');
const guildRepo = require('../data/repository/guild-repo');
const { canExecute } = require('../util/utils');

const commandsMap = new Map();

class Command extends BaseCommand {
    static metadata = {
        commandName: 'help',
        aliases: ['h'],
        description: 'Shows commands available to the person who initiated the command'
    };

    async execute() {
        const args = this.parseArgs(1);

        const commandName = args[0];

        let embed;

        if (commandName) {
            const config = await guildRepo.getConfig(this.dMsg.guildId);

            let command = commandsMap.get(commandName);

            if (!command) {
                for (const c of commandsMap.values()) {
                    if (c.metadata.aliases?.includes(commandName)) {
                        command = c;
                        break;
                    }
                }
            }

            if (!command || !canExecute(this.dMsg.member, command)) {
                return;
            }

            embed = new EmbedBuilder()
                .setTitle(command.metadata.commandName)
                .setColor(this.dMsg.guild.members.me.displayColor);

            if (command.metadata.description) {
                embed.setDescription(command.metadata.description);
            }

            if (command.metadata.aliases?.length > 0) {
                embed.addFields([{ name: 'Aliases:', value: command.metadata.aliases.join(', ') }]);
            }

            if (command.metadata.syntax) {
                embed.addFields([
                    { name: 'Syntax:', value: `\`${command.metadata.syntax.replace(/\{prefix\}/g, config.prefix)}\`` }
                ]);
            }

            if (command.metadata.examples?.length > 0) {
                embed.addFields([
                    {
                        name: 'Examples:',
                        value: command.metadata.examples.join('\n').replace(/\{prefix\}/g, config.prefix)
                    }
                ]);
            }
        } else {
            embed = new EmbedBuilder().setTitle('Commands:').setColor(this.dMsg.guild.members.me.displayColor);
            const fields = [...commandsMap.values()]
                .filter(c => canExecute(this.dMsg.member, c))
                .map(c => ({ name: c.metadata.commandName, value: c.metadata.description || '-' }));
            embed.addFields(fields);
        }

        this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

fs.readdirSync(__dirname)
    .filter(fileName => fileName.endsWith('.js') && !__filename.endsWith(fileName))
    .map(fileName => require(`./${fileName}`))
    .forEach(commandClass => {
        commandsMap.set(commandClass.metadata.commandName, commandClass);
    });

commandsMap.set(Command.metadata.commandName, Command);

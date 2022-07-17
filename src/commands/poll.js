const BaseCommand = require('../classes/base-command');
const { MessageEmbed } = require('discord.js');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'poll',
        description: 'Have the bot start a poll'
    };

    async execute() {
        const args = this.parseArgs(0).split(';');

        const embed = new MessageEmbed()
            .setTitle(args[args.length - 1].trim())
            .setColor('#ffffff');
        let body = '';

        const reactions = new Set();

        args.forEach((arg, i) => {
            arg = arg.trim();
            if (i < args.length - 1) {
                const optionEmote = arg.substring(0, arg.indexOf(' '));
                const optionText = arg.substring(arg.indexOf(' ') + 1);

                body += `${optionEmote} : ${optionText}\n`;
                reactions.add(optionEmote);
            }
        });

        embed.setDescription(body.trim());

        await this.dMsg.channel
            .send({ embeds: [embed] })
            .then(msg => reactions.forEach(reaction => msg.react(reaction)));
    }
}

module.exports = Command;

// !poll :check: Yes; :x: No; What is your answer?

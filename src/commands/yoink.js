const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const embedShop = require('../util/embed-shop');

const emoteRegex = /<:.+:(\d+)>/gm;
const animatedEmoteRegex = /<a:.+:(\d+)>/gm;

class Command extends BaseCommand {
    static metadata = {
        commandName: 'yoink',
        aliases: ['steal'],
        description: 'Steals an emote'
    };

    async execute() {
        let refMsg = await this.dMsg.fetchReference().catch(() => {});

        if (!refMsg) {
            const args = this.parseArgs(1);
            const messageId = args[0];
            refMsg = await this.dMsg.channel.messages.fetch(messageId);
        }

        if (!refMsg) {
            throw new UserError('No reference message provided. Please reply to a message or provide a message ID.');
        }

        let emoji = null;
        if ((emoji = emoteRegex.exec(refMsg.content))) {
            const url = 'https://cdn.discordapp.com/emojis/' + emoji[1] + '.png?v=1';
            this.dMsg.channel.send(url);
        } else if ((emoji = animatedEmoteRegex.exec(refMsg.content))) {
            const url = 'https://cdn.discordapp.com/emojis/' + emoji[1] + '.gif?v=1';
            this.dMsg.channel.send(url);
        } else {
            this.dMsg.channel.send({
                embeds: [embedShop.oneLineEmbed('The provided message does not contain an emoji', 'danger')]
            });
        }
    }
}

module.exports = Command;

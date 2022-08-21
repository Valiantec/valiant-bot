const BaseCommand = require('../classes/base-command');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'rate',
        description: 'Gives a random rating out of the provided number (10 by default)'
    };

    async execute() {
        const args = this.parseArgs(1);

        const max = parseInt(args[0]) || 10;

        await this.dMsg.channel.send(
            Math.floor(Math.random() * (max + 1)).toString()
        );
    }
}

module.exports = Command;

const BaseCommand = require('../classes/base-command');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'test'
    };

    async execute() {
        this.dMsg.react('🔁');
        setTimeout(() => {
            this.dMsg.reactions.removeAll();
            this.dMsg.react('✅');
        }, 1000);
    }
}

module.exports = Command;

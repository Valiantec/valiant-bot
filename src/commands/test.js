const { Permissions } = require('discord.js');
const BaseCommand = require('../classes/base-command');

class TestCommand extends BaseCommand {
    static metadata = {
        commandName: 'test',
        permissions: [Permissions.FLAGS.ADMINISTRATOR]
    };

    async execute() {
        this.dMsg.react('✅');
    }
}

module.exports = TestCommand;

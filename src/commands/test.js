const { Permissions } = require('discord.js');
const { forwardMessage } = require('../util/discord-utils');
const BaseCommand = require('../classes/base-command');
const { getMemberProfile } = require('../managers/data-manager');

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

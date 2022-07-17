const fs = require('fs');

const COMMANDS_PATH = './src/commands';

module.exports = {
    generateCommand: commandName => {
        const filePath = `${COMMANDS_PATH}/${commandName.toLowerCase()}.js`;

        let fileContent = `const BaseCommand = require('../classes/base-command');
const { Permissions } = require('discord.js');

class Command extends BaseCommand {
    static metadata = {
        commandName: '${commandName}',
        description: '',
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.ADMINISTRATOR]
    };

    async execute() {
        const args = this.parseArgs(1);

        const arg1 = args[0];

        // Command Logic Here
    }
}

module.exports = Command;
`;

        if (fs.existsSync(filePath)) {
            throw new Error('command already exists');
        }

        fs.writeFileSync(filePath, fileContent);
    }
};

if (process.argv[1] == __filename) {
    module.exports.generateCommand(process.argv[2]);
}

const { codeBlock } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'execute',
        description: 'executes javascript code',
        aliases: ['exec', 'js'],
        botOwnerOnly: true
    };

    async execute() {
        const arg = this.parseArgs(0);

        let code;
        if (arg.startsWith('```js')) {
            code = arg.slice(5, -3);
        } else if (arg.startsWith('```')) {
            code = arg.slice(3, -3);
        } else {
            code = arg;
        }

        try {
            // eslint-disable-next-line prefer-const
            let output = '';
            
            const func = eval(`
() => {
    const console = {
        log: (value) => {
            output += value + '\\n';
        }
    };

    try {
        ${code}
    } catch(err) {
        output += err.stack;
    }

}`);
            const result = func();
            this.dMsg.channel.send(`${codeBlock(output)}${result ? '**Returned:**\n' + codeBlock(result) : ''}`);
        } catch (err) {
            throw new UserError(err.message);
        }
    }
}

module.exports = Command;

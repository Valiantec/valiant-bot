const fs = require('fs');
const { LOGS_PATH, COMMAND_LOGS_PATH } = require('../constants');

try {
    fs.mkdirSync(LOGS_PATH);
    fs.mkdirSync(COMMAND_LOGS_PATH);
} catch (err) {}

module.exports = {
    log: (text) => {
        const logMessage = `[${new Date().toLocaleString()}]  ${text}`;
        console.log(logMessage);
        //logFile.write(logMessage + '\n');
    },

    logCommand: (command) => {
        try {
            fs.mkdirSync(`${COMMAND_LOGS_PATH}/${command.meta.commandName}`);
        } catch (err) {}
        fs.writeFileSync(
            `${COMMAND_LOGS_PATH}/${command.meta.commandName}/${new Date().toISOString().replace(/:/g, '-')}.json`,
            JSON.stringify(command, null, 4)
        );
    }
};

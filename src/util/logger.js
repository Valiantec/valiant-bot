const old = {};

const log = (...params) => {
  old.log(`[${new Date().toLocaleString()}]`, ...params);
};

const info = (...params) => {
  old.info(`[${new Date().toLocaleString()}]`, ...params);
};

const warn = (...params) => {
  old.warn(`[${new Date().toLocaleString()}]`, ...params);
};

const error = (...params) => {
  old.error(`[${new Date().toLocaleString()}]`, ...params);
};

module.exports = {
  integrate: () => {
    old.log = console.log;
    old.info = console.info;
    old.warn = console.warn;
    old.error = console.error;

    console.log = log;
    console.info = info;
    console.warn = warn;
    console.error = error;
  }
};

// const fs = require('fs');

// const LOGS_PATH = './logs';
// const COMMAND_LOGS_PATH = `${LOGS_PATH}/commands`;

// const runDate = new Date();
// const logFile = fs.createWriteStream(
//     `${LOGS_PATH}/${runDate.getFullYear()}-${
//         runDate.getMonth() + 1
//     }-${runDate.getDate()} ${runDate.getHours()}-${runDate.getMinutes()}-${runDate.getSeconds()}.txt`
// );

// try {
//     fs.mkdirSync(LOGS_PATH);
//     fs.mkdirSync(COMMAND_LOGS_PATH);
// } catch (err) {}

// module.exports = {
//     log: (text) => {
//         const logMessage = `[${new Date().toLocaleString()}]  ${text}`;
//         console.log(logMessage);
//         logFile.write(logMessage + '\n');
//     },

//     logCommand: (command) => {
//         try {
//             fs.mkdirSync(`${COMMAND_LOGS_PATH}/${command.meta.commandName}`);
//         } catch (err) {}
//         fs.writeFileSync(
//             `${COMMAND_LOGS_PATH}/${command.meta.commandName}/${new Date().toISOString().replace(/:/g, '-')}.json`,
//             JSON.stringify(command, null, 4)
//         );
//     }
// };

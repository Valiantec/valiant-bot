const { Message } = require('discord.js');
const { getFirstWord, removeFirstWord } = require('../util/str-utils');

class BaseCommand {
  /**
   *
   * @param {Message} dMsg
   * @param {string} argsString
   */
  constructor(dMsg, argsString) {
    this.dMsg = dMsg;
    this.argsString = argsString;
  }

  /**
   * Parses command arguments from the sent message
   * @param {number} argCount Number of arguments to parse (The rest of the text will be parsed as one argument)
   * @returns List of argument strings (all trimmed)
   */
  parseArgs(argCount) {
    let temp = this.argsString.trim();

    if (argCount == 0) {
      return temp;
    }

    const args = [];

    while (temp) {
      args.push(getFirstWord(temp));
      temp = removeFirstWord(temp);
      argCount--;
      if (argCount == 0 && temp) {
        args.push(temp);
        break;
      }
    }

    return args;
  }
}

module.exports = BaseCommand;

const path = require('path');
const fs = require('fs');
const { Client, PermissionFlagsBits, Collection } = require('discord.js');
const { treeCharacters } = require('../util/utils');

module.exports = {
  /**
   *
   * @param {Client} client
   */
  load: client => {
    console.log('Loading commands');

    client.commands = new Collection();

    fs.readdirSync(path.join(__dirname, '..', 'commands'))
      .filter(fileName => fileName.endsWith('.js'))
      .map(fileName => require(`../commands/${fileName}`))
      .sort((c1, c2) => {
        if (c1.metadata.botOwnerOnly) {
          return -1;
        }
        return c1.metadata.permissions?.toString().localeCompare(c2.metadata.permissions?.toString());
      })
      .forEach((Command, i, arr) => {
        client.commands.set(Command.metadata.commandName.toLowerCase(), Command);
        Command.metadata.aliases?.forEach(alias => client.commands.set(alias, Command));
        console.log(
          `${treeCharacters(i, arr.length)}[${
            Command.metadata.botOwnerOnly
              ? 'BOT_OWNER'
              : Command.metadata.permissions == PermissionFlagsBits.Administrator
              ? 'ADM'
              : Command.metadata.permissions == PermissionFlagsBits.ManageMessages
              ? 'MOD'
              : 'ALL'
          }] ${Command.metadata.commandName}`
        );
      });
  }
};

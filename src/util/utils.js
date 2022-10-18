const { GuildMember } = require('discord.js');

module.exports = {
  /**
   *
   * @param {GuildMember} member
   * @param {string[]} commandPermissions
   */
  canExecute: (member, command) => {
    if (command.metadata.botOwnerOnly) {
      return member.id === member.client.application.owner.id;
    }

    if (command.metadata.permissions) {
      return member.permissions.has(command.metadata.permissions, true);
    }

    return true;
  },

  /**
   *
   * @param {any[]} array
   */
  shuffleInPlace: array => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  },

  treeCharacters: (current, length) => {
    return current < length - 1 ? '├─' : '└─';
  }
};

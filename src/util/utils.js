const { GuildMember } = require('discord.js');

module.exports = {
    /**
     *
     * @param {GuildMember} member
     * @param {string[]} commandPermissions
     */
    canExecute: (member, commandPermissions) => {
        if (commandPermissions) {
            return member.permissions.has(commandPermissions, true);
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
    }
};

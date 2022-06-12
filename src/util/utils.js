const { GuildMember } = require('discord.js');

module.exports = {
    /**
     *
     * @param {GuildMember} member
     * @param {string[]} commandPermissions
     */
    canExecute: (member, commandPermissions) => {
        if (commandPermissions?.length > 0) {
            return member.permissions.has(commandPermissions, true);
        }

        return true;
    }
};

const { GuildMember, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     *
     * @param {GuildMember} member
     * @param {string} roleId
     * @returns {boolean}
     */
    hasRole: (member, roleId) => {
        return member?.roles.cache.some(role => role.id == roleId);
    },

    /**
     *
     * @param {GuildMember} member
     * @returns {boolean}
     */
    isMod: member => {
        return member?.permissions.has(PermissionFlagsBits.ManageMessages);
    },

    /**
     *
     * @param {GuildMember} member
     * @returns {boolean}
     */
    isAdmin: member => {
        return member?.permissions.has(PermissionFlagsBits.Administrator);
    }
};

const { PermissionFlagsBits, GuildMember, Message, Client, Guild } = require('discord.js');

module.exports = {
    /**
     * Check if member has a certain role
     * @param {GuildMember} member
     * @param {string} roleId
     */
    hasRole: (member, roleId) => {
        return member?.roles.cache.some(role => role.id == roleId);
    },

    /**
     * Check if member is an administrator
     * @param {GuildMember} member
     */
    isAdmin: member => {
        return member?.permissions.has(PermissionFlagsBits.Administrator);
    },

    /**
     * Check if member is a moderator
     * @param {GuildMember} member
     */
    isMod: member => {
        return member?.permissions.has(PermissionFlagsBits.ManageMessages);
    },

    /**
     *
     * @param {Client} client
     * @param {string} id
     */
    tryFetchUser: async (client, id) => {
        try {
            return await client.users.fetch(id);
        } catch {
            return null;
        }
    },

    /**
     *
     * @param {Guild} guild
     * @param {string} id
     */
    tryFetchMember: async (guild, id) => {
        try {
            return await guild.members.fetch(id);
        } catch {
            return null;
        }
    },

    /**
     *
     * @param {Guild} guild
     * @param {string} id
     */
    tryFetchChannel: async (guild, id) => {
        try {
            return await guild.channels.fetch(id);
        } catch {
            return null;
        }
    }
};

const {
    Guild,
    Message,
    GuildMember,
    TextChannel,
    Permissions
} = require('discord.js');

module.exports = {
    /**
     *
     * @param {string} text
     * @param {Message} sourceMsg
     * @param {(TextChannel|GuildMember)} target channelId or GuildMember object
     *
     * @throws {DiscordAPIError} if the bot can't send a message to the target
     */
    forwardMessage: async (text, sourceMsg, target) => {
        const msg = { content: text, files: sourceMsg.attachments };
        return target.send(msg);
    },

    /**
     *
     * @param {GuildMember} member
     * @param {string} roleId
     * @returns {boolean}
     */
    hasRole: (member, roleId) => {
        return member.roles.cache.some(role => role.id == roleId);
    },

    /**
     *
     * @param {GuildMember} member
     * @returns {boolean}
     */
    isMod: member => {
        return member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES);
    },

    /**
     *
     * @param {GuildMember} member
     * @returns {boolean}
     */
    isAdmin: member => {
        return member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    }
};

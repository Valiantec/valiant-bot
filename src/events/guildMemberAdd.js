const { GuildMember } = require('discord.js');
const { createMemberProfile, getConfig } = require('../managers/data-manager');

module.exports = {
    eventName: 'guildMemberAdd',
    /**
     * @param {GuildMember} member
     */
    execute: async member => {
        createMemberProfile(member.guild.id, member.id).catch(() => {});

        const config = await getConfig(member.guild.id);

        const welcomeMsg = config.welcomeMessage.replace('{member}', member);

        const welcomeChannel = member.guild.channels.cache.get(
            config.welcomeChannel
        );
        welcomeChannel?.send(welcomeMsg).catch(err => console.log(err.stack));
    }
};

const { createMemberProfile, getConfig } = require('../managers/data-manager');

module.exports = {
    eventName: 'guildMemberAdd',
    execute: async member => {
        createMemberProfile(member.guild.id, member.id).catch(() => {});

        const config = await getConfig(member.guild.id);
        const welcomeMsg = config.welcomeMessage.replace('{member}', member);
        member.guild.channels.cache.get(config.welcomeChannel).send(welcomeMsg);
    }
};

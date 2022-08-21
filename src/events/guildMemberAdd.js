const { GuildMember, Events } = require('discord.js');
const repo = require('../data/repository');

module.exports = {
    eventName: Events.GuildMemberAdd,
    /**
     * @param {GuildMember} member
     */
    execute: async member => {
        if (member.user.bot) {
            return;
        }

        repo.createMemberProfile(member.guild.id, member.id).catch(() => {});

        const config = await repo.getGuildConfig(member.guild.id);

        const welcomeChannel = await member.guild.channels.fetch(
            config.welcomeChannel
        );

        if (welcomeChannel) {
            const welcomeMsg = config.welcomeMessage.replace(
                /\{member\}/g,
                member
            );
            welcomeChannel
                .send(welcomeMsg)
                .catch(err => console.log(err.stack));
        }
    }
};

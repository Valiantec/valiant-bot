const { GuildMember, Events } = require('discord.js');
const guildRepo = require('../data/repository/guild-repo');
const memberRepo = require('../data/repository/member-repo');

module.exports = {
    eventName: Events.GuildMemberAdd,
    /**
     * @param {GuildMember} member
     */
    execute: async member => {
        if (member.user.bot) {
            return;
        }

        memberRepo.create(member.guild.id, member.id).catch(() => {});

        const config = await guildRepo.getConfig(member.guild.id);

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

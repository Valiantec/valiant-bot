const { Guild, Events } = require('discord.js');
const repo = require('../data/repository');

module.exports = {
    eventName: Events.GuildCreate,
    /**
     * 
     * @param {Guild} guild 
     */
    execute: async guild => {
        console.log(`+ Joined Guild: ${guild.name}`);
        await repo.createGuildProfile(guild.id);
    }
};

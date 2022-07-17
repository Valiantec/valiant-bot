const { Guild } = require('discord.js');
const { createGuildProfile } = require('../managers/data-manager');

module.exports = {
    eventName: 'guildCreate',
    /**
     * @param {Guild} guild
     */
    execute: guild => {
        console.log(`+ Joined Guild: ${guild.name}`);
        createGuildProfile(guild.id).catch(err => console.log(err));
    }
};

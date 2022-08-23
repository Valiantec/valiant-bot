const { Client, Events } = require('discord.js');
const { getGuildProfile } = require('../data/repository');
const activityTracker = require('../service/activity-tracker');

module.exports = {
    eventName: Events.ClientReady,
    execOnce: true,
    /**
     * @param {Client} client
     */
    execute: async client => {
        await client.application.fetch();

        const guilds = await client.guilds.fetch();

        guilds.forEach(async guild => {
            await getGuildProfile(guild.id);
        });

        const guildNames = guilds.map(g => g.name);

        console.log(`${client.user.username} is running on (${guilds.size}) guilds: ${guildNames.join(', ')}`);

        activityTracker.startTracking();
    }
};

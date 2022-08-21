const { Client, Events } = require('discord.js');
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
        
        const guildNames = guilds.map(g => g.name);

        console.log(
            `${client.user.username} is running on (${
                guilds.size
            }) guilds: ${guildNames.join(', ')}`
        );

        activityTracker.startTracking();
    }
};

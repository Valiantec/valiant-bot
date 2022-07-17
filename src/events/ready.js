const { Client } = require('discord.js');

module.exports = {
    eventName: 'ready',
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
    }
};

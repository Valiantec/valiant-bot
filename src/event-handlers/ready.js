const logger = require('../util/logger');

module.exports = {
    eventName: 'ready',
    execOnce: true,
    execute: async client => {
        await client.application.fetch();
        const guilds = await client.guilds.fetch();
        const guildNames = guilds.map(g => g.name);
        logger.log(
            `${client.user.username} is running on (${
                guilds.size
            }) guilds: ${guildNames.join(', ')}`
        );
    }
};

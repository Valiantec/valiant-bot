const { db } = require('../firebase');
const logger = require('../util/logger');
const configTemplate = require('../config-template.json');
module.exports = {
    eventName: 'guildCreate',
    execute: guild => {
        db.collection('guilds')
            .doc(guild.id)
            .create({
                id: guild.id,
                config: configTemplate
            })
            .then(() => logger.log(`Joined New Guild: ${guild.name}`))
            .catch(err => logger.log(err));
    }
};

const configTemplate = require('../config-template.json');

module.exports = {
    memberProfile: memberId => {
        return {
            id: memberId,
            points: 0
        };
    },
    guildProfile: guildId => {
        return {
            id: guildId,
            config: configTemplate
        };
    }
};

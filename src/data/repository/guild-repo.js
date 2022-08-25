const { db } = require('../third-party/firebase');
const guildConfigTemplate = require('../../res/guild-config-template.json');

const configCache = new Map();

async function getById(guildId) {
    const doc = await db.collection('guilds').doc(guildId).get();
    if (doc.exists) {
        return doc.data();
    } else {
        await create(guildId);
        return await getById(guildId);
    }
}

async function create(guildId) {
    const profile = {
        id: guildId,
        config: guildConfigTemplate
    };
    try {
        await db.collection('guilds').doc(guildId).create(profile);
        return true;
    } catch (err) {
        return false;
    }
}

async function getConfig(guildId) {
    let config = configCache.get(guildId);

    if (!config) {
        const doc = await db.collection('guilds').doc(guildId).get();
        config = doc.data().config;
    }

    if (!config) {
        config = guildConfigTemplate;
        updateConfig(guildId, config);
    }

    return config;
}

async function updateConfig(guildId, config) {
    configCache.set(guildId, config);
    await db.collection('guilds').doc(guildId).update('config', config);
}

module.exports = {
    getById,
    create,
    getConfig,
    updateConfig
};

const { db } = require('./third-party/firebase');
const guildConfigTemplate = require('../res/guild-config-template.json');

const configCache = new Map();

async function createMemberProfile(guildId, memberId, tag = null) {
    const profile = {
        id: memberId,
        points: 0
    };

    if (tag) {
        profile.tag = tag;
    }

    try {
        await db
            .collection('guilds')
            .doc(guildId)
            .collection('members')
            .doc(memberId)
            .create(profile);
        return true;
    } catch (err) {
        return false;
    }
}

async function getMemberProfile(guildId, memberId, createIfNotExist = true) {
    const doc = await db
        .collection('guilds')
        .doc(guildId)
        .collection('members')
        .doc(memberId)
        .get();
    if (doc.exists) {
        return doc.data();
    } else if (createIfNotExist) {
        await createMemberProfile(guildId, memberId);
        return await getMemberProfile(guildId, memberId);
    }
}

async function updateMemberProfile(guildId, profile) {
    await db
        .collection('guilds')
        .doc(guildId)
        .collection('members')
        .doc(profile.id)
        .set(profile);
}

async function createGuildProfile(guildId) {
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

async function getGuildProfile(guildId) {
    const doc = await db.collection('guilds').doc(guildId).get();
    if (doc.exists) {
        return doc.data();
    } else {
        await module.exports.createGuildProfile(guildId);
        return await module.exports.getGuildProfile(guildId);
    }
}

async function getGuildConfig(guildId) {
    let config = configCache.get(guildId);

    if (!config) {
        const doc = await db.collection('guilds').doc(guildId).get();
        config = doc.data().config;
    }

    if (!config) {
        config = guildConfigTemplate;
        updateGuildConfig(guildId, config);
    }

    return config;
}

async function updateGuildConfig(guildId, config) {
    configCache.set(guildId, config);
    await db.collection('guilds').doc(guildId).update('config', config);
}

module.exports = {
    createMemberProfile,
    getMemberProfile,
    updateMemberProfile,

    createGuildProfile,
    getGuildProfile,

    getGuildConfig,
    updateGuildConfig
};

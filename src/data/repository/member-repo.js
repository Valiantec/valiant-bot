const { db } = require('../third-party/firebase');

async function getById(guildId, memberId, createIfNotExist = true) {
    const doc = await db.collection('guilds').doc(guildId).collection('members').doc(memberId).get();
    if (doc.exists) {
        return doc.data();
    } else if (createIfNotExist) {
        await create(guildId, memberId);
        return await getById(guildId, memberId);
    }
}

async function getByMember(member, createIfNotExist = true) {
    return getById(member.guild.id, member.id, createIfNotExist);
}

async function create(guildId, memberId, tag = null) {
    const profile = {
        id: memberId,
        points: 0
    };

    if (tag) {
        profile.tag = tag;
    }

    try {
        await db.collection('guilds').doc(guildId).collection('members').doc(memberId).create(profile);
        return true;
    } catch (err) {
        return false;
    }
}

async function update(guildId, profile) {
    await db.collection('guilds').doc(guildId).collection('members').doc(profile.id).set(profile);
}

module.exports = {
    getById,
    getByMember,
    create,
    update
};

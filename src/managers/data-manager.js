const { db } = require('../firebase');

module.exports = {
    getConfig: async guildId => {
        const doc = await db.collection('guilds').doc(guildId).get();
        return doc.data().config;
    },

    writeConfig: async (guildId, cfg) => {
        if (!cfg) {
            return;
        }

        await db.collection('guilds').doc(guildId).update('config', cfg);
    },

    getMemberProfile: async (guildId, memberId) => {
        const doc = await db
            .collection('guilds')
            .doc(guildId)
            .collection('members')
            .doc(memberId)
            .get();
        if (doc.exists) {
            return doc.data();
        } else {
            await module.exports.createMemberProfile(guildId, memberId);
            return await module.exports.getMemberProfile(guildId, memberId);
        }
    },

    writeMemberProfile: async (guildId, memberProfile) => {
        await db
            .collection('guilds')
            .doc(guildId)
            .collection('members')
            .doc(memberProfile.id)
            .set(memberProfile);
    },

    createMemberProfile: async (guildId, memberId) => {
        await db
            .collection('guilds')
            .doc(guildId)
            .collection('members')
            .doc(memberId)
            .create({
                id: memberId,
                points: 0
            });
    }
};

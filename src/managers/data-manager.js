const { db } = require('../firebase');
const generator = require('../generator');

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

    /**
     *
     * @param {string} guildId
     * @param {string} memberId
     * @returns `true` if the member profile was created and `false` otherwise
     */
    createMemberProfile: async (guildId, memberId) => {
        try {
            await db
                .collection('guilds')
                .doc(guildId)
                .collection('members')
                .doc(memberId)
                .create(generator.memberProfile(memberId));
            return true;
        } catch (err) {
            return false;
        }
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

    /**
     *
     * @param {string} guildId
     * @returns `true` if the guild profile was created and `false` otherwise
     */
    createGuildProfile: async guildId => {
        try {
            await db
                .collection('guilds')
                .doc(guildId)
                .create(generator.guildProfile(guildId));
            return true;
        } catch (err) {
            return false;
        }
    },

    getGuildProfile: async guildId => {
        const doc = await db.collection('guilds').doc(guildId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            await module.exports.createGuildProfile(guildId);
            return await module.exports.getGuildProfile(guildId);
        }
    }
};

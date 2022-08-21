const repo = require('../../data/repository');
const { Message } = require('discord.js');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {string} text
 */
async function doNote(dMsg, userId, text) {
    const user = await dMsg.client.users.fetch(userId);

    const profile = await repo.getMemberProfile(dMsg.guildId, userId);

    profile.tag = user.tag;

    if (!profile.record) {
        profile.record = {};
    }

    if (!profile.record.notes) {
        profile.record.notes = [];
    }

    profile.record.notes.push({
        text: text,
        by: dMsg.author.tag,
        date: new Date().toISOString()
    });

    await repo.updateMemberProfile(dMsg.guildId, profile);
}

module.exports = {
    doNote
};

const memberRepo = require('../../data/repository/member-repo');
const { Message } = require('discord.js');
const { isMod } = require('../../util/discord-utils');
const { logModerationAction } = require('../messaging');
const UserError = require('../../classes/errors/user-error');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {number} duration
 * @param {string} text
 */
async function doTimeout(dMsg, userId, duration, text) {
    const member = await dMsg.guild.members.fetch(userId);

    if (isMod(member)) {
        throw new UserError('Member is mod');
    }

    await member.timeout(duration * 60 * 1000, text);

    await logModerationAction(
        dMsg,
        `**${member} | ${userId}** has been timed out for **${duration} minutes** by **${dMsg.author.tag}**: ${text}`
    );

    const profile = await memberRepo.getById(dMsg.guildId, userId);

    profile.tag = member.user.tag;

    if (!profile.record) {
        profile.record = {};
    }

    if (!profile.record.timeouts) {
        profile.record.timeouts = [];
    }

    profile.record.timeouts.push({
        text: text,
        duration: duration,
        by: dMsg.author.tag,
        date: new Date().toISOString()
    });

    await memberRepo.update(dMsg.guildId, profile);

    await member.send(
        `You received a timeout in **${dMsg.guild.name}**:\n${text}`
    );
}

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 */
async function removeTimeout(dMsg, userId) {
    const member = await dMsg.guild.members.fetch(userId);

    if (!member.communicationDisabledUntilTimestamp) {
        return;
    }

    await member.timeout(null);

    await logModerationAction(
        dMsg,
        `**${member} | ${userId}** timeout has been removed by **${dMsg.author.tag}**`
    );

    await member.send(
        `Your timeout in **${dMsg.guild.name}** has been removed`
    );
}

module.exports = {
    doTimeout,
    removeTimeout
};

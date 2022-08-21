const repo = require('../../data/repository');
const { Message } = require('discord.js');
const { isMod } = require('../../util/discord-utils');
const { logModerationAction } = require('../messaging');
const UserError = require('../../classes/errors/user-error');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {string} text
 */
async function doWarn(dMsg, userId, text) {
    const member = await dMsg.guild.members.fetch(userId);

    if (isMod(member)) {
        throw new UserError('Member is mod');
    }

    await member.send(
        `You received a warning from **${dMsg.guild.name}**:\n${text}`
    );

    const profile = await repo.getMemberProfile(dMsg.guildId, userId);

    profile.tag = member.user.tag;

    if (!profile.record) {
        profile.record = {};
    }

    if (!profile.record.warnings) {
        profile.record.warnings = [];
    }

    profile.record.warnings.push({
        text: text,
        by: dMsg.author.tag,
        date: new Date().toISOString()
    });

    await repo.updateMemberProfile(dMsg.guildId, profile);

    await logModerationAction(
        dMsg,
        `**${member} | ${userId}** has been warned by **${dMsg.author.tag}**: ${text}`
    );
}

module.exports = {
    doWarn
};

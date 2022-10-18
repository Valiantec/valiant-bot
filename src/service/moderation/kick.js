const memberRepo = require('../../data/repository/member-repo');
const { Message } = require('discord.js');
const { isMod } = require('../../util/discord-utils');
const { logModerationAction } = require('../messaging');
const UserError = require('../../classes/errors/user-error');
const InvalidActionOnUserError = require('../../classes/errors/invalid-action-on-user-error');
const MemberNotFoundError = require('../../classes/errors/member-not-found-error');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {string} text
 */
async function doKick(dMsg, userId, text) {
  const member = await dMsg.guild.members.fetch(userId).catch(() => {});

  if (!member) {
    throw new MemberNotFoundError();
  } else if (isMod(member)) {
    throw new InvalidActionOnUserError();
  }

  if (member?.kickable) {
    await member.kick(text);

    await logModerationAction(dMsg, `**${member} | ${userId}** has been kicked by **${dMsg.author.tag}**: ${text}`);

    const profile = await memberRepo.getByMember(member);

    profile.tag = member.user.tag;

    if (!profile.record) {
      profile.record = {};
    }

    if (!profile.record.kicks) {
      profile.record.kicks = [];
    }

    profile.record.kicks.push({
      text: text,
      by: dMsg.author.tag,
      date: new Date().toISOString()
    });

    await memberRepo.update(dMsg.guildId, profile);
  }
}

module.exports = {
  doKick
};

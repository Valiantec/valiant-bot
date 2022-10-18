const memberRepo = require('../../data/repository/member-repo');
const { Message } = require('discord.js');
const { isMod, tryFetchMember } = require('../../util/discord-utils');
const { logModerationAction } = require('../messaging');
const UserError = require('../../classes/errors/user-error');
const InvalidActionOnUserError = require('../../classes/errors/invalid-action-on-user-error');
const MemberNotFoundError = require('../../classes/errors/member-not-found-error');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {number} duration
 * @param {string} text
 */
async function doTimeout(dMsg, userId, duration, text) {
  const member = await tryFetchMember(dMsg.guild, userId);

  if (!member) {
    throw new MemberNotFoundError();
  } else if (isMod(member)) {
    throw new InvalidActionOnUserError();
  }

  await member.timeout(duration * 60 * 1000, text);

  await logModerationAction(
    dMsg,
    `**${member} [${userId}]** has been timed out for **${duration} minutes** by **${
      dMsg.author.id == userId ? 'Automod' : dMsg.author.tag
    }**: ${text}`
  );

  const profile = await memberRepo.getByMember(member);

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
    by: dMsg.author.id == userId ? 'Automod' : dMsg.author.tag,
    date: new Date().toISOString()
  });

  await memberRepo.update(dMsg.guildId, profile);

  await member.send(`You received a timeout in **${dMsg.guild.name}**:\n${text}`);
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

  await logModerationAction(dMsg, `**${member} | ${userId}** timeout has been removed by **${dMsg.author.tag}**`);

  await member.send(`Your timeout in **${dMsg.guild.name}** has been removed`);
}

module.exports = {
  doTimeout,
  removeTimeout
};

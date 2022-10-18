const memberRepo = require('../../data/repository/member-repo');
const { Message } = require('discord.js');
const { isMod, tryFetchMember } = require('../../util/discord-utils');
const { logModerationAction } = require('../messaging');
const UserError = require('../../classes/errors/user-error');
const MemberNotFoundError = require('../../classes/errors/member-not-found-error');
const InvalidActionOnUserError = require('../../classes/errors/invalid-action-on-user-error');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {string} text
 */
async function doWarn(dMsg, userId, text) {
  const member = await tryFetchMember(dMsg.guild, userId);

  if (!member) {
    throw new MemberNotFoundError();
  } else if (isMod(member)) {
    throw new InvalidActionOnUserError();
  }

  await member.send(`You received a warning from **${dMsg.guild.name}**:\n${text}`);

  const profile = await memberRepo.getByMember(member);

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

  await memberRepo.update(dMsg.guildId, profile);

  await logModerationAction(dMsg, `**${member} | ${userId}** has been warned by **${dMsg.author.tag}**: ${text}`);
}

module.exports = {
  doWarn
};

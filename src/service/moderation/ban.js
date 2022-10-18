const memberRepo = require('../../data/repository/member-repo');
const { Message } = require('discord.js');
const { isMod } = require('../../util/discord-utils');
const { logModerationAction } = require('../messaging');
const UserError = require('../../classes/errors/user-error');
const InvalidActionOnUserError = require('../../classes/errors/invalid-action-on-user-error');

/**
 *
 * @param {Message} dMsg
 * @param {string} userId
 * @param {string} text
 */
async function doBan(dMsg, userId, text) {
  try {
    if (await dMsg.guild.bans.fetch(userId)) {
      throw new UserError(`❌ <@${userId}> is already banned`);
    }
  } catch (e) {
    if (e.rawError?.message != 'Unknown Ban') {
      throw e;
    }
  }

  const member = await dMsg.guild.members.fetch(userId).catch(() => {});

  if (isMod(member)) {
    throw new InvalidActionOnUserError();
  }

  const user = await dMsg.client.users.fetch(userId);

  await dMsg.guild.bans.create(userId, {
    deleteMessageDays: 7,
    reason: text
  });

  await logModerationAction(dMsg, `**${user} | ${userId}** has been banned by **${dMsg.author.tag}**: ${text}`);

  const profile = await memberRepo.getById(dMsg.guildId, userId);

  profile.tag = user.tag;

  if (!profile.record) {
    profile.record = {};
  }

  if (!profile.record.bans) {
    profile.record.bans = [];
  }

  profile.record.bans.push({
    text: text,
    by: dMsg.author.tag,
    date: new Date().toISOString()
  });

  await memberRepo.update(dMsg.guildId, profile);
}

module.exports = {
  doBan
};

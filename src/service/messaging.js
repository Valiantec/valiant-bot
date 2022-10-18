const { Message, TextChannel, GuildMember } = require('discord.js');
const guildRepo = require('../data/repository/guild-repo');

/**
 *
 * @param {string} text
 * @param {TextChannel | GuildMember} target
 * @param {Message} sourceMsg
 * @throws {DiscordAPIError} if the bot can't send a message to the target
 */
async function forwardMessage(text, target, sourceMsg = null) {
  await target?.send({
    content: text,
    files: sourceMsg ? [...sourceMsg.attachments.values()] : []
  });
}

/**
 *
 * @param {string} text
 * @param {TextChannel | GuildMember} target
 * @param {Message} sourceMsg
 * @throws {DiscordAPIError} if the bot can't send a message to the target
 */
async function tryForwardMessage(text, target, sourceMsg = null) {
  await forwardMessage(text, target, sourceMsg).catch(err => {
    sourceMsg?.channel.send('❌ Message failed to send').catch(() => {});
    throw err;
  });
}

/**
 *
 * @param {Message} dMsg
 * @param {string} text
 */
async function logModerationAction(dMsg, text) {
  const config = await guildRepo.getConfig(dMsg.guildId);
  if (config.logging.enabled) {
    const channelId = config.logging.overrides.moderation || config.logging.channelId;
    const logsChannel = await dMsg.guild.channels.fetch(channelId);
    await logsChannel.send(text);
  }
}

module.exports = {
  forwardMessage,
  tryForwardMessage,
  logModerationAction
};

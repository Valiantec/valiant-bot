const { Message, TextChannel, GuildMember } = require('discord.js');
const repo = require('../data/repository');

/**
 *
 * @param {string} text
 * @param {TextChannel | GuildMember} target
 * @param {Message} sourceMsg
 * @throws {DiscordAPIError} if the bot can't send a message to the target
 */
async function forwardMessage(text, target, sourceMsg = null) {
    await target?.send({ content: text, files: sourceMsg ? [...sourceMsg.attachments.values()] : [] });
}

/**
 *
 * @param {string} text
 * @param {TextChannel | GuildMember} target
 * @param {Message} sourceMsg
 * @throws {DiscordAPIError} if the bot can't send a message to the target
 */
async function tryForwardMessage(text, target, sourceMsg = null) {
    await forwardMessage(text, target, sourceMsg).catch(() =>
        sourceMsg?.channel.send('❌ Message failed to send').catch(() => {})
    );
}

/**
 *
 * @param {Message} dMsg
 * @param {string} text
 */
async function logModerationAction(dMsg, text) {
    const config = await repo.getGuildConfig(dMsg.guildId);
    if (config.logsChannel) {
        const logsChannel = await dMsg.guild?.channels.fetch(config.logsChannel);
        await logsChannel.send(text);
    }
}

module.exports = {
    forwardMessage,
    tryForwardMessage,
    logModerationAction
};

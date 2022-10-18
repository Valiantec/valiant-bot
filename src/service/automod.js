const { isAdmin, isMod } = require('../util/discord-utils');
const { doTimeout, doWarn, doKick, doBan } = require('./moderation');

module.exports = {
  checkMessage: (msg, config) => {
    if (isAdmin(msg.member)) {
      return false;
    }

    let deleteMessage = false;

    if (config.automod.keywordBlocker.enabled) {
      const matchedWords = msg.content
        .split(/\s/)
        .filter(word => config.automod.keywordBlocker.keywords.includes(word));

      if (config.automod.keywordBlocker.blockServerInvites && msg.content.includes('discord.gg/')) {
        matchedWords.push('SERVER_INVITE');
      }

      if (matchedWords.length > 0) {
        const reason = `Used blocked word(s): ${matchedWords.join(', ')} in <#${msg.channelId}>`;

        if (config.automod.keywordBlocker.punishment == 'warn') {
          doWarn(msg, msg.author.id, reason);
        } else if (config.automod.keywordBlocker.punishment == 'kick') {
          doKick(msg, msg.author.id, reason);
        } else if (config.automod.keywordBlocker.punishment == 'ban') {
          doBan(msg, msg.author.id, reason);
        } else if (config.automod.keywordBlocker.punishment == 'timeout') {
          doTimeout(msg, msg.author.id, config.automod.keywordBlocker.duration, reason);
        }

        deleteMessage = true;
      }
    }

    return deleteMessage;
  }
};

const { Message, Events } = require('discord.js');
const activityTracker = require('../service/activity-tracker');
const guildRepo = require('../data/repository/guild-repo');
const automod = require('../service/automod');
const { forwardMessage } = require('../service/messaging');
const { handleCommand } = require('../service/command-handler');
const { isMod } = require('../util/discord-utils');

module.exports = {
  eventName: Events.MessageCreate,
  /**
   * @param {Message} msg
   */
  execute: async msg => {
    if (msg.author.bot) {
      return;
    }

    // Handle DMs
    if (!msg.guild) {
      console.log(`DM from ${msg.author.tag} [${msg.author.id}]: ${msg.content}`);

      forwardMessage(`**DM from <@${msg.author.id}>:**\n${msg.content}`, msg.client.application.owner, msg).catch(err =>
        console.log(err)
      );

      return;
    }

    const config = await guildRepo.getConfig(msg.guildId);

    if (config.points.enabled && config.points.messages) {
      activityTracker.notifyActivity(msg.member);
    }

    let deleteMessage = false;

    if (config.automod.enabled) {
      deleteMessage = automod.checkMessage(msg, config);
    }

    if (!isMod(msg.member) && config.mediaOnlyChannels?.includes(msg.channelId) && msg.attachments.size == 0) {
      deleteMessage = true;
    }

    if (msg.content.startsWith(config.prefix)) {
      handleCommand(msg, config);
    }

    if (deleteMessage && msg.deletable) {
      await msg.delete().catch(err => console.log(err));
    }
  }
};

const { GuildMember, Events } = require('discord.js');
const guildRepo = require('../data/repository/guild-repo');
const memberRepo = require('../data/repository/member-repo');
const { welcomeMember } = require('../service/welcome');

module.exports = {
  eventName: Events.GuildMemberAdd,
  /**
   * @param {GuildMember} member
   */
  execute: async member => {
    if (member.user.bot) {
      return;
    }

    const config = await guildRepo.getConfig(member.guild.id);

    memberRepo.create(member.guild.id, member.id).catch(console.error);

    if (config.welcome.enabled) {
      welcomeMember(member, config);
    }
  }
};

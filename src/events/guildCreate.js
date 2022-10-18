const { Guild, Events } = require('discord.js');
const guildRepo = require('../data/repository/guild-repo');

module.exports = {
  eventName: Events.GuildCreate,
  /**
   *
   * @param {Guild} guild
   */
  execute: async guild => {
    console.log(`Guild: ${guild.name} : Joined`);
    const profileCreated = await guildRepo.create(guild.id);
    console.log(`Guild: ${guild.name} : ${profileCreated ? 'Profile Created' : 'Profile already exists'}`);
  }
};

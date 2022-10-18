const { tryFetchChannel } = require('../util/discord-utils');

module.exports = {
  welcomeMember: async (member, config) => {
    const welcomeChannel = await tryFetchChannel(member.guild, config.welcome.channelId);

    if (welcomeChannel) {
      const welcomeMsg = config.welcome.message.replace(/\{member\}/g, member);
      welcomeChannel.send(welcomeMsg).catch(err => console.log(err.stack));
    }
  }
};

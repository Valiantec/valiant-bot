const { EmbedBuilder } = require('discord.js');
const { ACCENT_COLOR, ERROR_COLOR, WARNING_COLOR, SUCCESS_COLOR } = require('../config/config');

module.exports = {
  oneLineEmbed: (text, type = null) => {
    const embed = new EmbedBuilder().setDescription(text).setColor(ACCENT_COLOR);

    if (type == 'error') {
      embed.setColor(ERROR_COLOR);
    } else if (type == 'warn') {
      embed.setColor(WARNING_COLOR);
    } else if (type == 'success') {
      embed.setColor(SUCCESS_COLOR);
    }

    return embed;
  }
};

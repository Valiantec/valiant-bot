const { MessageEmbed } = require('discord.js');
const { ERROR_COLOR, WARNING_COLOR, SUCCESS_COLOR, HELP_COLOR } = require('../constants');

module.exports = {
    oneLineEmbed: (text, type = null, colorResolvable = null, showIcon = false) => {
        const embed = new MessageEmbed();

        if (type == 'danger') {
            embed.setDescription((showIcon ? '❌ ' : '') + text);
            embed.setColor(ERROR_COLOR);
        } else if (type == 'warning') {
            embed.setDescription((showIcon ? '⚠ ' : '') + text);
            embed.setColor(WARNING_COLOR);
        } else if (type == 'success') {
            embed.setDescription((showIcon ? '✅ ' : '') + text);
            embed.setColor(SUCCESS_COLOR);
        } else {
            embed.setDescription(text);
            embed.setColor('#ffffee');
        }

        if (colorResolvable) {
            embed.setColor(colorResolvable);
        }

        return embed;
    },

    singleCommandHelpEmbed: (metadata) => {
        const embed = new MessageEmbed().setTitle('Command: ' + metadata.commandName).setColor(HELP_COLOR);

        if (metadata.description) {
            embed.addField('Description', metadata.description);
        }

        if (metadata.aliases?.length > 0) {
            embed.addField('Aliases', metadata.aliases.join(', '));
        }

        if (metadata.args?.length > 0) {
            embed.addField('Arguments', metadata.args.join(', '));
        }

        return embed;
    },

    helpCommandEmbed: (commandsMetaData) => {
        const embed = new MessageEmbed().setTitle('Commands:').setColor(HELP_COLOR);

        commandsMetaData.forEach((meta) => embed.addField(meta.commandName, meta.description || '-'));

        return embed;
    }
};

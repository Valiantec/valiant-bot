const { EmbedBuilder, Colors } = require('discord.js');
const { ERROR_COLOR, WARNING_COLOR, SUCCESS_COLOR, HELP_COLOR } = require('../config/config');

module.exports = {
    oneLineEmbed: (text, type = null, colorResolvable = null, showIcon = false) => {
        const embed = new EmbedBuilder();

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
            embed.setColor(Colors.White);
        }

        if (colorResolvable) {
            embed.setColor(colorResolvable);
        }

        return embed;
    },

    singleCommandHelpEmbed: metadata => {
        const embed = new EmbedBuilder().setTitle('Command: ' + metadata.commandName).setColor(HELP_COLOR);

        if (metadata.description) {
            embed.addFields([{ name: 'Description', value: metadata.description }]);
        }

        if (metadata.aliases?.length > 0) {
            embed.addFields([{ name: 'Aliases', value: metadata.aliases.join(', ') }]);
        }

        if (metadata.args?.length > 0) {
            embed.addFields([{ name: 'Arguments', value: metadata.args.join(', ') }]);
        }

        return embed;
    },

    helpCommandEmbed: commandsMetaData => {
        const embed = new EmbedBuilder().setTitle('Commands:').setColor(HELP_COLOR);
        const fields = [];
        commandsMetaData.forEach(meta =>
            fields.push({
                name: meta.commandName,
                value: meta.description || '-'
            })
        );
        embed.addFields(fields);

        return embed;
    }
};

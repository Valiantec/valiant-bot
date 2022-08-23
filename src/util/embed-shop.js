const { EmbedBuilder } = require('discord.js');
const { ACCENT_COLOR, ERROR_COLOR, WARNING_COLOR, SUCCESS_COLOR, HELP_COLOR } = require('../config/config');

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
    },

    singleCommandHelpEmbed: (metadata, prefix) => {
        const embed = new EmbedBuilder().setTitle(metadata.commandName).setColor(HELP_COLOR);

        if (metadata.description) {
            embed.addFields([{ name: 'Description:', value: metadata.description || '-' }]);
        }

        if (metadata.aliases?.length > 0) {
            embed.addFields([{ name: 'Aliases:', value: metadata.aliases.join(', ') }]);
        }

        if (metadata.syntax) {
            embed.addFields([{ name: 'Syntax:', value: `\`${metadata.syntax.replace(/\{prefix\}/g, prefix)}\`` }]);
        }

        if (metadata.examples?.length > 0) {
            embed.addFields([
                { name: 'Examples:', value: `\`${metadata.examples.join('\n').replace(/\{prefix\}/g, prefix)}\`` }
            ]);
        }

        return embed;
    },

    helpCommandEmbed: commandsMetaData => {
        const embed = new EmbedBuilder().setTitle('Commands:').setColor(ACCENT_COLOR);
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

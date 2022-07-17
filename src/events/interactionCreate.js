const { Interaction } = require('discord.js');
const Slash = require('../slash-commands/slash');

module.exports = {
    eventName: 'interactionCreate',
    /**
     * @param {Interaction} interaction
     */
    execute: async interaction => {
        if (interaction.isCommand()) {
            if (interaction.commandName == 'slash') {
                new Slash(interaction, null).execute();
            }
        }
    }
};

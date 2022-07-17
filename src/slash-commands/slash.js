const BaseCommand = require('../classes/base-command');
const {
    Permissions,
    Interaction,
    User,
    GuildMember,
    CommandInteraction
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'slash',
        description: 'Test slash commands',
        permissions: PermissionFlagsBits.Administrator
    };

    static getSlashCommandConfig() {
        return new SlashCommandBuilder()
            .setName(this.metadata.commandName)
            .setDescription(this.metadata.description)
            .setDefaultMemberPermissions(this.metadata.permissions)
            .addUserOption(option =>
                option
                    .setName('member')
                    .setDescription("A user mention")
            ).setDMPermission(false);
    }

    async execute() {
        /**
         * @type {CommandInteraction}
         */
        const interaction = this.dMsg;
        const user = interaction.options.getUser('member');
        await user.send('Slashed to pieces!');
        interaction.reply('Member Slashed Successfully! ✅');
    }
}

module.exports = Command;

const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const { getGuildConfig, updateGuildConfig } = require('../data/repository');
const embedShop = require('../util/embed-shop');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'mediaonly',
        aliases: ['mo'],
        permissions: PermissionFlagsBits.Administrator
    };

    async execute() {
        const args = this.parseArgs(1);

        const channelId = args[0]?.replace(/[<#>]/g, '') || this.dMsg.channelId;

        const config = await getGuildConfig(this.dMsg.guildId);

        if (!config.mediaOnlyChannels) {
            config.mediaOnlyChannels = [];
        }

        let state;
        if (config.mediaOnlyChannels.includes(channelId)) {
            config.mediaOnlyChannels = config.mediaOnlyChannels.filter(
                id => id != channelId
            );
            state = 'OFF';
        } else {
            config.mediaOnlyChannels.push(channelId);
            state = 'ON';
        }

        await updateGuildConfig(this.dMsg.guildId, config);

        this.dMsg.channel.send({
            embeds: [
                embedShop.oneLineEmbed(
                    `<#${channelId}> media-only: \`${state}\``
                )
            ]
        });
    }
}

module.exports = Command;

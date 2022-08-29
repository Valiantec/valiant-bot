const { EmbedBuilder } = require('discord.js');
const BaseCommand = require('../classes/base-command');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'info',
        description: 'Shows general info about the bot'
    };

    async execute() {
        const bot = this.dMsg.client.user;
        const owner = this.dMsg.client.application.owner;
        const serverCount = this.dMsg.client.guilds.cache.size;
        const embed = new EmbedBuilder()
            .setTitle('Bot Information')
            .addFields([
                { name: 'Owner', value: owner.tag },
                { name: 'Servers', value: serverCount.toString() }
            ])
            .setThumbnail(bot.avatarURL())
            .setColor(this.dMsg.guild.members.me.displayColor);
        await this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

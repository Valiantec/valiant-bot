const { MessageEmbed } = require('discord.js');
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
        const embed = new MessageEmbed()
            .setTitle('Bot Information')
            .addField('Owner', owner.tag)
            .addField('Servers', serverCount.toString())
            .setThumbnail(bot.avatarURL())
            .setColor('#ffffff');
        await this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

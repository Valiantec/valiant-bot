const { Permissions } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const { getMemberProfile } = require('../managers/data-manager');
const { oneLineEmbed } = require('../util/embed-shop');

class ProfileCommand extends BaseCommand {
    static metadata = {
        commandName: 'profile',
        description: "Shows a member's full profile",
        permissions: [Permissions.FLAGS.MANAGE_MESSAGES]
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0];

        if (!memberId) {
            throw new UserError('No member id provided');
        }

        const memberProfile = await getMemberProfile(
            this.dMsg.guildId,
            memberId
        );

        const profileString = JSON.stringify(memberProfile, null, 2);

        const msgContent = `\`\`\`json\n${profileString}\n\`\`\``;

        if (profileString.length < 1800) {
            await this.dMsg.reply({
                embeds: [oneLineEmbed(`Profile owner: <@${memberId}>`)],
                content: msgContent
            });
        } else {
            await this.dMsg.reply('Memeber profile is too large');
        }
    }
}

module.exports = ProfileCommand;

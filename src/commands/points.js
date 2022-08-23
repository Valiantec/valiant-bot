const BaseCommand = require('../classes/base-command');
const embedShop = require('../util/embed-shop');
const UserError = require('../classes/errors/user-error');
const repo = require('../data/repository');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'points',
        description: 'Check how many points a member has'
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0]?.replace(/[<@>]/g, '') || this.dMsg.member.id;

        const profile = await repo.getMemberProfile(this.dMsg.guildId, memberId);
        if (profile) {
            this.dMsg.channel.send({
                embeds: [embedShop.oneLineEmbed(`<@${memberId}> has \`${profile.points}\` points`)]
            });
        } else {
            throw new UserError('Member not found');
        }
    }
}

module.exports = Command;

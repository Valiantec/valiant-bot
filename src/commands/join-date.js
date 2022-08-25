const BaseCommand = require('../classes/base-command');
const MemberNotFoundError = require('../classes/errors/member-not-found-error');
const { tryFetchMember } = require('../util/discord-utils');
const { oneLineEmbed } = require('../util/embed-shop');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'joindate',
        description: 'Shows the date at which a member has joined this server',
        aliases: ['joined']
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0];

        const member = memberId ? await tryFetchMember(this.dMsg.guildId, memberId) : this.dMsg.member;

        if (!member) {
            throw new MemberNotFoundError();
        }

        await this.dMsg.channel.send(
            oneLineEmbed(
                `${member} joined the server on \`${member.joinedAt.toISOString().split('.')[0].replace('T', '  ')}\``
            )
        );
    }
}

module.exports = Command;

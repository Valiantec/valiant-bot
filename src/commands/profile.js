const { PermissionFlagsBits, EmbedBuilder, time, codeBlock } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const memberRepo = require('../data/repository/member-repo');
const { tryFetchMember, tryFetchUser } = require('../util/discord-utils');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'profile',
        aliases: ['user', 'u', 'p'],
        description: "Shows a member's full profile",
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0]?.replace(/[<@>]/g, '') || this.dMsg.member.id;

        const member = await tryFetchMember(this.dMsg.guild, memberId);

        const profile = await memberRepo.getById(this.dMsg.guildId, memberId, member != null);

        if (!profile) {
            throw new UserError('Not found');
        }

        const embed = new EmbedBuilder()
            .setFooter({ text: `ID: ${profile.id}` })
            .setColor(member.displayColor);

        if (profile.tag) {
            embed.setAuthor({ name: profile.tag });
        }

        if (member) {
            embed.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() });
            embed.setDescription(`**Created:** ${time(member.user.createdAt)}\n**Joined:** ${time(member.joinedAt)}`);
        } else {
            const user = await tryFetchUser(this.dMsg.client, memberId);
            if (user) {
                embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
                embed.setDescription(embed.data.description + `\n**Created:** ${time(user.createdAt)}`);
            }
        }

        embed.setDescription(embed.data.description + `\n**Points:** ${profile.points}`)

        if (profile.record) {
            const fields = [];

            if (profile.record.notes?.length > 0) {
                let text = '';
                profile.record.notes.forEach(note => {
                    text += codeBlock(`Text: ${note.text}\nBy:   ${note.by}\nDate: ${note.date}`);
                });
                fields.push({ name: 'Notes:', value: text });
            }

            if (profile.record.warnings?.length > 0) {
                let text = '';
                profile.record.warnings.forEach(warning => {
                    text += codeBlock(`Reason: ${warning.text}\nBy:     ${warning.by}\nDate:   ${warning.date}`);
                });
                fields.push({ name: 'Warnings:', value: text });
            }

            if (profile.record.timeouts?.length > 0) {
                let text = '';
                profile.record.timeouts.forEach(timeout => {
                    text += codeBlock(
                        `Reason:   ${timeout.text}\nDuration: ${timeout.duration} minutes\nBy:       ${timeout.by}\nDate:     ${timeout.date}`
                    );
                });
                fields.push({ name: 'Timeouts:', value: text });
            }

            if (profile.record.bans?.length > 0) {
                let text = '';
                profile.record.bans.forEach(ban => {
                    text += codeBlock(`Reason: ${ban.text}\nBy:     ${ban.by}\nDate:   ${ban.date}`);
                });
                fields.push({ name: 'Bans:', value: text });
            }

            embed.addFields(fields);
        }

        await this.dMsg.channel.send({ embeds: [embed] });
    }
}

module.exports = Command;

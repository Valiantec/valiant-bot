const { PermissionFlagsBits, EmbedBuilder, time, codeBlock } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const UserError = require('../classes/errors/user-error');
const repo = require('../data/repository');

class Command extends BaseCommand {
    static metadata = {
        commandName: 'profile',
        aliases: ['user', 'u'],
        description: "Shows a member's full profile",
        permissions: PermissionFlagsBits.ManageMessages
    };

    async execute() {
        const args = this.parseArgs(1);

        const memberId = args[0]?.replace(/[<@>]/g, '') || this.dMsg.member.id;

        const member = await this.dMsg.guild.members.fetch(memberId).catch(() => {});

        const profile = await repo.getMemberProfile(this.dMsg.guildId, memberId, member != null);

        if (!profile) {
            throw new UserError('Not found');
        }

        const embed = new EmbedBuilder().setDescription(`**ID:** ${profile.id}\n**Points:** ${profile.points}`);

        if (profile.tag) {
            embed.setAuthor({ name: profile.tag });
        }

        if (member) {
            embed.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() });
            embed.setDescription(
                embed.data.description +
                    `\n**Created:** ${time(member.user.createdAt)}\n**Joined:** ${time(member.joinedAt)}`
            );
        } else {
            const user = await this.dMsg.client.users.fetch(memberId).catch(() => {});
            if (user) {
                embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() });
                embed.setDescription(embed.data.description + `\n**Created:** ${time(user.createdAt)}`);
            }
        }

        if (profile.record) {
            const fields = [];

            if (profile.record.notes) {
                let text = '';
                profile.record.notes.forEach(note => {
                    text += codeBlock(`Text: ${note.text}\nBy:   ${note.by}\nDate: ${note.date}`);
                });
                fields.push({ name: 'Notes:', value: text });
            }

            if (profile.record.warnings) {
                let text = '';
                profile.record.warnings.forEach(warning => {
                    text += codeBlock(`Reason: ${warning.text}\nBy:     ${warning.by}\nDate:   ${warning.date}`);
                });
                fields.push({ name: 'Warnings:', value: text });
            }

            if (profile.record.timeouts) {
                let text = '';
                profile.record.timeouts.forEach(timeout => {
                    text += codeBlock(
                        `Reason:   ${timeout.text}\nDuration: ${timeout.duration} minutes\nBy:       ${timeout.by}\nDate:     ${timeout.date}`
                    );
                });
                fields.push({ name: 'Timeouts:', value: text });
            }

            if (profile.record.bans) {
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

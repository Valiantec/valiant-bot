const BaseCommand = require('../classes/base-command');
const memberRepo = require('../data/repository/member-repo');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { tryFetchMember } = require('../util/discord-utils');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'toppoints',
    description: 'Show the top 10 members with the most points',
    permissions: PermissionFlagsBits.ManageMessages
  };

  async getMemberTag(memberId) {
    const member = await tryFetchMember(this.dMsg.guild, memberId);
    return member?.user.tag;
  }

  async execute() {
    const topProfiles = await memberRepo.getTopMembersByPoints(this.dMsg.guildId, 10);
    const embed = new EmbedBuilder().setTitle('Top 10 Members');

    await Promise.all(
      topProfiles.map(async profile => {
        profile.tag = (await this.getMemberTag(profile.id)) || profile.tag;
        return profile;
      })
    );

    const fields = [];
    topProfiles.forEach((profile, index) => {
      fields.push({
        name: `${index + 1}. ${profile.tag}`,
        value: profile.points.toString()
      });
    });
    embed.addFields(fields);

    await this.dMsg.channel.send({
      embeds: [embed]
    });
  }
}

module.exports = Command;

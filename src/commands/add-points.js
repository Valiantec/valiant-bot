const { PermissionFlagsBits } = require('discord.js');
const BaseCommand = require('../classes/base-command');
const MemberNotFoundError = require('../classes/errors/member-not-found-error');
const InvalidArgumentsError = require('../classes/errors/invalid-arguments-error');
const memberRepo = require('../data/repository/member-repo');
const { tryFetchMember } = require('../util/discord-utils');
const { oneLineEmbed } = require('../util/embed-shop');
const activityTracker = require('../service/activity-tracker');

class Command extends BaseCommand {
  static metadata = {
    commandName: 'addpoints',
    description: 'Adds an amount of points to a member',
    syntax: '{prefix}addpoints <memberID> <points>',
    examples: ['{prefix}addpoints 123123123 50'],
    permissions: PermissionFlagsBits.ManageMessages
  };

  async execute() {
    const args = this.parseArgs(2);

    const memberId = args[0]?.replace(/[<@>]/g, '');
    const points = parseInt(args[1]);

    if (isNaN(points) || points < 1) {
      throw new InvalidArgumentsError();
    }

    const member = await tryFetchMember(this.dMsg.guild, memberId);

    if (!member) {
      throw new MemberNotFoundError();
    }

    const profile = await memberRepo.getByMember(member, member != null);

    profile.points += points;
    profile.tag = member.user.tag;

    await Promise.all([
      memberRepo.update(this.dMsg.guildId, profile),
      activityTracker.updateMemberRank(member, profile.points),
      this.dMsg.channel.send({ embeds: [oneLineEmbed(`Gave \`${points}\` points to ${member}`, 'success')] })
    ]);
  }
}

module.exports = Command;

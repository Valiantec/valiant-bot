const { Client, ChannelType, GuildMember } = require('discord.js');
const memberRepo = require('../data/repository/member-repo');
const guildRepo = require('../data/repository/guild-repo');

const recentlyActiveMembersPerGuild = new Map();

let trackingIntervalId;

/**
 *
 * @param {GuildMember} member
 * @returns {string} The name of the new rank
 */
async function updateMemberRank(member, points = null) {
  const ranks = (await guildRepo.getConfig(member.guild.id)).ranking.rankList?.sort(
    (r1, r2) => r2.threshold - r1.threshold
  );

  if (!ranks || ranks.length == 0) {
    return;
  }

  for (const rank of ranks) {
    if (member.roles.cache.has(rank.roleId)) {
      return;
    }

    const memberPoints = points ?? (await memberRepo.getByMember(member)).points;

    if (memberPoints >= rank.threshold) {
      const rolesToRemove = ranks.filter(r => r.roleId != rank.roleId).map(r => r.roleId);
      const newRole = await member.guild.roles.fetch(rank.roleId);

      member.roles.set(
        member.roles.cache.filter(r => !rolesToRemove.includes(r.id)).set(newRole.id, newRole),
        'Rank Up'
      );

      return newRole;
    }
  }
}

async function distributePoints() {
  for (const [guildId, memberSet] of recentlyActiveMembersPerGuild) {
    for (const member of [...memberSet]) {
      memberRepo.getByMember(member).then(profile => {
        profile.points++;
        profile.tag = member.user.tag;
        memberRepo.update(guildId, profile);
        updateMemberRank(member, profile.points);
      });
    }
  }
  recentlyActiveMembersPerGuild.clear();
}

/**
 * Possible bad performance
 * @param {Client} client
 *
 */
async function determineVCPoints(client) {
  for (const [_, guild] of client.guilds.cache) {
    const config = await guildRepo.getConfig(guild.id);
    if (config.points.enabled && config.points.voice) {
      guild.channels.cache
        .filter(channel => channel.type == ChannelType.GuildVoice)
        .forEach(channel => {
          channel.members.forEach(member => {
            if (!member.user.bot && !member.voice.mute && !member.voice.deaf) {
              notifyActivity(member);
            }
          });
        });
    }
  }
}

function notifyActivity(member) {
  let memberSet = recentlyActiveMembersPerGuild.get(member.guild.id);

  if (!memberSet) {
    memberSet = new Set();
    recentlyActiveMembersPerGuild.set(member.guild.id, memberSet);
  }

  memberSet.add(member);
}

module.exports = {
  notifyActivity,
  startTracking: client => {
    trackingIntervalId = setInterval(async () => {
      await determineVCPoints(client);
      distributePoints();
    }, 60 * 1000);
  },
  stopTracking: () => {
    clearInterval(trackingIntervalId);
  },
  updateMemberRank
};

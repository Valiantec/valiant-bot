const { Client, Guild, ChannelType, GuildMember } = require('discord.js');
const memberRepo = require('../data/repository/member-repo');
const guildRepo = require('../data/repository/guild-repo');

const recentlyActiveMembersPerGuild = new Map();

let trackingIntervalId;

// /**
//      *
//      * @param {GuildMember} member
//      * @param {MemberProfile} memberProfile
//      * @param {boolean} shouldSendRankUpMessage
//      */
//  async function determineRank(member, shouldSendRankUpMessage = true) {
//     let memberProfile;
//     try {
//         memberProfile = readMember(member.id);
//     } catch (err) {
//         memberProfile = new MemberProfile(member.id, member.user.tag);
//         writeMember(memberProfile);
//     }
//     const ranks = [...readConfig().ranks].reverse();
//     const rankIds = ranks.map((r) => r.roleId);

//     for (const rank of ranks) {
//         if (memberProfile.points >= rank.threshold) {
//             if (member.roles.cache.has(rank.roleId)) {
//                 break;
//             }
//             await member.roles.remove(rankIds);
//             member.roles.add(rank.roleId).then((m) => {
//                 const rankName = m.roles.cache.get(rank.roleId).name;
//                 if (shouldSendRankUpMessage) {
//                     this.sendRankUpMessage(readConfig().rankUpMessagesChannel, member, rankName);
//                 }
//             });
//             break;
//         }
//     }
// }

/**
 *
 * @param {GuildMember} member
 * @returns {string} The name of the new rank
 */
async function updateMemberRank(member) {
    const ranks = (await guildRepo.getConfig(member.guild.id)).ranks?.sort((r1, r2) => r2.threshold - r1.threshold);

    if (!ranks || ranks.length == 0) {
        return;
    }

    for (const rank of ranks) {
        if (member.roles.cache.has(rank.roleId)) {
            return;
        }

        const profile = await memberRepo.getByMember(member);

        if (profile.points >= rank.threshold) {
            const rolesToRemove = ranks.filter(r => r.roleId != rank.roleId).map(r => r.roleId);
            const newRole = await member.guild.roles.fetch(rank.roleId);

            member.roles.set(member.roles.cache.filter(r => !rolesToRemove.includes(r.id)).set(newRole.id, newRole), 'Rank Up');

            return newRole;
        }
    }
}

async function distributePoints() {
    for (const [guildId, memberSet] of recentlyActiveMembersPerGuild) {
        for (const member of [...memberSet]) {
            memberRepo.getByMember(member).then(profile => {
                profile.points++;
                profile.tag = member.user.tag || profile.tag;
                memberRepo.update(guildId, profile);
                updateMemberRank(member);
            });
        }
    }
    recentlyActiveMembersPerGuild.clear();
}

/**
 *
 * @param {Client} client
 */
function determineVCPoints(client) {
    client.guilds.cache.forEach(guild => {
        guild.channels.cache
            .filter(channel => channel.type == ChannelType.GuildVoice)
            .forEach(channel => {
                channel.members.forEach(member => {
                    if (!member.voice.mute && !member.voice.deaf && !member.user.bot) {
                        notifyActivity(member, guild.id);
                    }
                });
            });
    });
}

function notifyActivity(member, guildId) {
    let memberSet = recentlyActiveMembersPerGuild.get(guildId);

    if (!memberSet) {
        memberSet = new Set();
        recentlyActiveMembersPerGuild.set(guildId, memberSet);
    }

    memberSet.add(member);
}

module.exports = {
    notifyActivity,
    startTracking: client => {
        trackingIntervalId = setInterval(() => {
            determineVCPoints(client);
            distributePoints();
        }, 60 * 1000);
    },
    stopTracking: () => {
        clearInterval(trackingIntervalId);
    }
};

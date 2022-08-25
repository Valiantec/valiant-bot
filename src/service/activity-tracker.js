const memberRepo = require('../data/repository/member-repo');

const membersActiveInLastMinute = new Map();

let trackingIntervalId;

async function distributePoints() {
    for (const [guildId, memberSet] of membersActiveInLastMinute) {
        for (const member of [...memberSet]) {
            memberRepo.getById(guildId, member.id).then(profile => {
                profile.points++;
                profile.tag = member.tag || profile.tag;
                memberRepo.update(guildId, profile);
            });
        }
    }
    membersActiveInLastMinute.clear();
}

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

// /**
//      *
//      * @param {Guild} guild
//      */
//  async function trackActivity(guild) {
//     await guild.channels.fetch();

//     // track voice activity
//     const channels = guild.channels.cache.filter(
//         (c) => c.type === 'GUILD_VOICE' && !readConfig().activityExcludedChannels.some((id) => id == c.id)
//     );
//     for (const [channelId, channel] of channels) {
//         for (const [memberId, member] of channel.members) {
//             if (!member.voice.mute && !member.user.bot) {
//                 this.addPoints(member, 1, 'voice-chat');
//             }
//         }
//     }

//     // text activity cooldown reset
//     this.messagedPrev60Secs.clear();
// }

module.exports = {
    notifyActivity: (member, guildId) => {
        let memberSet = membersActiveInLastMinute.get(guildId);

        if (!memberSet) {
            memberSet = new Set();
            membersActiveInLastMinute.set(guildId, memberSet);
        }

        memberSet.add(member);
    },
    startTracking: () => {
        trackingIntervalId = setInterval(() => {
            distributePoints();
        }, 60 * 1000);
    },
    stopTracking: () => {
        clearInterval(trackingIntervalId);
    }
};

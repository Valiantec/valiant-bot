const repo = require('../data/repository');

const membersActiveInLastMinute = new Map();

let trackingIntervalId;

async function distributePoints() {
    for (const [guildId, memberSet] of membersActiveInLastMinute) {
        for (const member of [...memberSet]) {
            repo.getMemberProfile(guildId, member.id).then(profile => {
                profile.points++;
                profile.tag = member.tag || profile.tag;
                repo.updateMemberProfile(guildId, profile);
            });
        }
    }
    membersActiveInLastMinute.clear();
}

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

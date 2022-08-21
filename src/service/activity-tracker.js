const repo = require('../data/repository');

const membersActiveInLastMinute = new Map();

let trackingIntervalId;

async function distributePoints() {
    for (const [guildId, memberSet] of membersActiveInLastMinute) {
        for (const memberId of [...memberSet]) {
            repo.getMemberProfile(guildId, memberId).then(profile => {
                profile.points++;
                repo.updateMemberProfile(guildId, profile);
            });
        }
    }
    membersActiveInLastMinute.clear();
}

module.exports = {
    notifyActivity: (memberId, guildId) => {
        let memberSet = membersActiveInLastMinute.get(guildId);

        if (!memberSet) {
            memberSet = new Set();
            membersActiveInLastMinute.set(guildId, memberSet);
        }

        memberSet.add(memberId);
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

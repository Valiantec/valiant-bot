const fs = require('fs');
const { db } = require('../data/third-party/firebase');

const PROFILES_PATH = 'D:\\MyData\\Projects\\Discord\\ValiantBot-Gaming.js\\data\\member-profiles';

const profiles = fs.readdirSync(PROFILES_PATH).map(file => require(PROFILES_PATH + '\\' + file));

profiles.forEach(async profile => {
    if (profile.id) {
        const newProfile = {
            id: profile.id
        };

        if (profile.tag) {
            newProfile.tag = profile.tag;
        }

        newProfile.points = profile.points || 0;

        if (
            profile.record?.notes?.length > 0 ||
            profile.record?.warnings?.length > 0 ||
            profile.record?.mutes?.length > 0 ||
            profile.record?.bans?.length > 0
        ) {
            newProfile.record = {};
        }

        if (profile.record?.notes?.length > 0) {
            newProfile.record.notes = profile.record.notes;
        }
        if (profile.record?.warnings?.length > 0) {
            newProfile.record.warnings = profile.record.warnings;
        }
        if (profile.record?.mutes?.length > 0) {
            newProfile.record.mutes = profile.record.mutes;
        }
        if (profile.record?.bans?.length > 0) {
            newProfile.record.bans = profile.record.bans;
        }

        db.collection('guilds').doc('570533833242443796').collection('members').doc(profile.id).set(newProfile);
    } else {
        console.warn(`Profile has no id:\n${profile}`);
    }
});

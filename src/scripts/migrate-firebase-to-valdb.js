const { default: axios } = require('axios');
const { db } = require('../data/third-party/firebase');

db.collection('guilds')
  .get()
  .then(guildsSnapshot => {
    guildsSnapshot.docs.forEach(guildDoc => {
      axios.put(`http://localhost:4200?docPath=guilds\\${guildDoc.id}`, guildDoc.data()).then(() => {
        db.collection('guilds')
          .doc(guildDoc.id)
          .collection('members')
          .get()
          .then(membersSnapshot => {
            membersSnapshot.docs.forEach(memberDoc => {
              axios
                .put(`http://localhost:4200?docPath=guilds\\${guildDoc.id}\\members\\${memberDoc.id}`, memberDoc.data())
                .catch(err => console.log(err.message));
            });
          });
      });
    });
  });

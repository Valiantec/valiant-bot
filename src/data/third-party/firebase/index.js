const admin = require('firebase-admin');
const serviceAccount = require('./firebase-adminsdk.json');

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    app,
    db: app.firestore()
};

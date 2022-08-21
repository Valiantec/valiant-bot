const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account-key.json');

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {
    app,
    db: app.firestore()
};

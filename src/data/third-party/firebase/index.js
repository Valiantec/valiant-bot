const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account-key.json')[process.env.DEPLOYMENT_ENV];

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  app,
  db: app.firestore()
};

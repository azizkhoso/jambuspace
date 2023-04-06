const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { NODE_ENV, SESS_NAME, SESS_SECRET, SESS_LIFETIME } = require('../config');

const isProduction = NODE_ENV === 'production';

module.exports = function (app) {
  if (isProduction) {
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      name: SESS_NAME,
      secret: SESS_SECRET,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'session',
        ttl: parseInt(SESS_LIFETIME) / 1000,
      }),
      saveUninitialized: true,
      resave: true,
      cookie: {
        // sameSite: true,
        secure: false,
        // httpOnly: true,
        maxAge: parseInt(SESS_LIFETIME),
      },
    }),
  );
};

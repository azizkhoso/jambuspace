const mongoose = require('mongoose');
const logger = require('../helpers/logger');
const { MONGO_URI } = require('../config');

module.exports = function () {
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex');

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((conn) => console.log(`> 👍 Connected to MongoDB... ${conn.connection.host}`))
    .catch((err) => logger.error(`Could not connect to MongoDB!!! \n ${err}`));
};

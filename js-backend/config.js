require('dotenv').config();
const {
  PORT = process.env.PORT || 4000,
  NODE_ENV = process.env.NODE_ENV || 'production',
  // MONGO_URI = "mongodb://localhost/jambu-space",
  // MONGO_URI = "mongodb+srv://admin:admin@1122@cluster0.l8mwz.mongodb.net/jambu-space?retryWrites=true&w=majority",
  // MONGO_URI = "mongodb+srv://mughees:mughees@cluster0.lfi1k.mongodb.net/?retryWrites=true&w=majority",
  // MONGO_URI = "mongodb://admin:admin@cluster0-shard-00-00.fojxb.mongodb.net:27017,cluster0-shard-00-01.fojxb.mongodb.net:27017,cluster0-shard-00-02.fojxb.mongodb.net:27017/?ssl=true&replicaSet=atlas-zt1m81-shard-0&authSource=admin&retryWrites=true&w=majority",
  // MONGO_URI = 'mongodb+srv://faisalskp:faisalskp@cluster0.w14zq.mongodb.net/?retryWrites=true&w=majority',
  MONGO_URI = process.env.MONGO_URI,
  SESS_NAME = 'sid',
  SESS_SECRET = 'secret!session',
  SESS_LIFETIME = 1000 * 60 * 60 * 24 * 7,
  SENDGRID_API_KEY = 'SG.',
  CREATE_USER_SECRET = 'abcd',
} = process.env;

module.exports = {
  PORT,
  NODE_ENV,
  MONGO_URI,
  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,
  SENDGRID_API_KEY,
  CREATE_USER_SECRET,
};

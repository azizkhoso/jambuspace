module.exports = function () {
  require('../helpers/logger');

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
};

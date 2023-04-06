const logger = require("../helpers/logger");

module.exports = function (err, req, res, next) {
  console.log("Error Middleware: ", err);
  logger.error(err);
  res.status(500).send(err);
  // res.status(500).json({ message: "Something Failed" });
};

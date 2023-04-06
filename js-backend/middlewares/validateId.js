const isValidObjectId = require("mongoose").isValidObjectId;

module.exports = function (req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid id provided!" });
  } else {
    next();
  }
};

module.exports = function (req, res, next) {
  if (!(req.session && req.session.user)) {
    return res
      .status(401)
      .send("Access denied. No or Invalid Credentials provided.");
  } else {
    next();
  }
};

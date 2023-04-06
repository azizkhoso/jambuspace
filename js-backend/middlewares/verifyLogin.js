// verify whether user is logged in or not
module.exports = (req, res, next) => {
  if (!req.session?.user) res.status(403).json({ message: 'Not logged in' });
  else next();
};

module.exports = function (handler) {
  routeHandler = async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
  return routeHandler;
};

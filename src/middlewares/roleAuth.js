const ApiError = require('../helpers/errorHandler');

const hasRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      const found = roles.some((el) => el === req.user.role);
      if (found) return next();

      throw ApiError.forbidden('Forbidden access');
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  hasRole,
};

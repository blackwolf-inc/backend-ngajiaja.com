const jwt = require('jsonwebtoken');
const ApiError = require('../helpers/errorHandler');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) throw ApiError.unauthorized('Unauthorized');

    const splitToken = req.headers.authorization.split(' ');
    if (splitToken.length !== 2 || splitToken[0] !== 'Bearer') {
      throw ApiError.badRequest('Wrong authorization format');
    }

    jwt.verify(
      splitToken[1],
      process.env.JWT_SECRET_KEY,
      { algorithms: ['HS256'] },
      async (err, payload) => {
        try {
          if (err && err.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Expired Token');
          } else if (err) {
            throw ApiError.unauthorized('Invalid Token');
          } else {
            req.user = payload;
            next();
          }
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

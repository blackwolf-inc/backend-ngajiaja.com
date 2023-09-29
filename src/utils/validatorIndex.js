const { validationResult } = require('express-validator');
const ApiError = require('../helpers/errorHandler');

module.exports = (validations) => {
  return async (req, res, next) => {
    try {
      await Promise.all(validations.map((validation) => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // const extractedErrors = {};
      // errors.array().forEach((value) => {
      //   console.log(value);
      //   if (!value.path) return;

      //   if (!extractedErrors[value.path]) extractedErrors[value.path] = [value.msg];
      //   else extractedErrors[value.path].push(value.msg);
      // });

      throw ApiError.unprocessableEntity('Please check your input data', errors.array());
    } catch (error) {
      next(error);
    }
  };
};

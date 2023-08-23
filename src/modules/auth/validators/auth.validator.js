const { check, body } = require('express-validator');

const reqResetPasswordValidator = [
    check('email')
      .notEmpty()
      .withMessage('Can not be empty')
      .bail()
      .isEmail()
      .withMessage('Must be in email format')
      .bail()
      .isString()
      .withMessage('Must be string'),
];

const resetPasswordValidator = [
  check('token')
    .notEmpty()
    .withMessage('Can not be empty'),
  check('password')
    .exists()
    .withMessage('Must have password')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters'),
];

module.exports = {
  reqResetPasswordValidator,
  resetPasswordValidator,
};
  
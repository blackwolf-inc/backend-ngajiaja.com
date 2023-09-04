const { check, body } = require('express-validator');

const createBiayaAdminPesertaValidator = [
  check('user_id')
    .exists()
    .withMessage('Must have user_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isInt()
    .withMessage('Must be integer'),
  check('bank_id')
    .exists()
    .withMessage('Must have bank_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isInt()
    .withMessage('Must be integer'),
];

const updateBiayaAdminPesertaValidator = [
  check('user_id')
    .if(body('user_id').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isInt()
    .withMessage('Must be integer'),
  check('bank_id')
    .if(body('bank_id').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isInt()
    .withMessage('Must be integer'),
];

module.exports = {
  createBiayaAdminPesertaValidator,
  updateBiayaAdminPesertaValidator,
};

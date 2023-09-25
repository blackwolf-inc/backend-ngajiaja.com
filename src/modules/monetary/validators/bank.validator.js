const { check } = require('express-validator');

const createBankValidator = [
  check('nama_bank')
    .exists()
    .withMessage('Must have nama_bank')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('atas_nama')
    .exists()
    .withMessage('Must have atas_nama')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('no_rekening')
    .exists()
    .withMessage('Must have no_rekening')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
];

module.exports = createBankValidator;

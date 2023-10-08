const { check, checkExact, body } = require('express-validator');

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
  checkExact([check('nama_bank'), check('atas_nama'), check('no_rekening')]),
];

const updateBankValidator = [
  check('nama_bank')
    .if(body('nama_bank').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('atas_nama')
    .if(body('atas_nama').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('no_rekening')
    .if(body('no_rekening').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
];

module.exports = { createBankValidator, updateBankValidator };

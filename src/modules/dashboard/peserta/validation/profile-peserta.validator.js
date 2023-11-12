const { check, body } = require('express-validator');

const updateUserValidator = [
  check('nama')
    .if(body('nama').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('telp_wa')
    .if(body('telp_wa').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isNumeric()
    .withMessage('Must be number contained only'),
  check('jenis_kelamin')
    .if(body('jenis_kelamin').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['L', 'P'])
    .withMessage('User jenis_kelamin must be L / P'),
  check('alamat')
    .if(body('alamat').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('tgl_lahir')
    .if(body('tgl_lahir').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isISO8601()
    .toDate()
    .withMessage('Must be using correct format yyyy-mm-dd'),
  check('profesi')
    .if(body('profesi').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
];

module.exports = updateUserValidator;

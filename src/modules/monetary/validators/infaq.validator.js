const { check, body } = require('express-validator');

const createInfaqValidator = [
  check('peserta_id')
    .exists()
    .withMessage('Must have peserta_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('pengajar_id')
    .exists()
    .withMessage('Must have pengajar_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('bank_id')
    .exists()
    .withMessage('Must have bank_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('periode_id')
    .exists()
    .withMessage('Must have periode_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('status')
    .exists()
    .withMessage('Must have status')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .isIn(['WAITING', 'ACCEPTED', 'REJECTED'])
    .withMessage('level must be WAITING / ACCEPTED / REJECTED'),
  check('nominal')
    .exists()
    .withMessage('Must have nominal')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer/double'),
];

const updateInfaqValidator = [
  check('status')
    .if(body('status').exists())
    .notEmpty()
    .withMessage('Must have status')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['WAITING', 'ACCEPTED', 'REJECTED'])
    .withMessage('status must be: WAITING / ACCEPTED / REJECTED'),
  check('keterangan')
    .if(body('keterangan').exists())
    .notEmpty()
    .withMessage('Must have keterangan')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
];

module.exports = {
  createInfaqValidator,
  updateInfaqValidator,
};

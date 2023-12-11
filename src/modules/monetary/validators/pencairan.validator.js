const { check, body } = require('express-validator');

const createPencairanValidator = [
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

const updatePencairanValidator = [
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
  createPencairanValidator,
  updatePencairanValidator,
};

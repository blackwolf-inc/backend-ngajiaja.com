const { check, body } = require('express-validator');

const updatePencairanPengajar = [
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
    .isIn(['REJECTED', 'ACCEPTED', 'WAITING'])
    .withMessage('status must be: REJECTED / ACCEPTED / WAITING'),
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

module.exports = updatePencairanPengajar;

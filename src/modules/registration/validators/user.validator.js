const { check, body } = require('express-validator');
const { USER_ROLE } = require('../../../helpers/constanta');

const createUserValidator = [
  check('role')
    .exists()
    .withMessage('Must have role')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['ADMIN', 'PENGAJAR', 'PESERTA'])
    .withMessage('User role must be ADMIN / PENGAJAR / PESERTA'),
  check('nama')
    .exists()
    .withMessage('Must have nama')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('email')
    .exists()
    .withMessage('Must have email')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isEmail()
    .withMessage('Must be in email format')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('telp_wa')
    .exists()
    .withMessage('Must have telp_wa')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isNumeric()
    .withMessage('Must be number contained only'),
  check('jenis_kelamin')
    .exists()
    .withMessage('Must have jenis_kelamin')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['L', 'P'])
    .withMessage('User jenis_kelamin must be L / P'),
  check('alamat')
    .exists()
    .withMessage('Must have alamat')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('usia')
    .exists()
    .withMessage('Must have usia')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be number contained only'),
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
  check('status')
    .exists()
    .withMessage('Must have status')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .custom((value, { req }) => {
      switch (req.body.role) {
        case USER_ROLE.PENGAJAR:
          const statusPengajar = [
            'REGISTERED',
            'WAITING',
            'INTERVIEWED',
            'REJECTED',
            'ACTIVE',
            'NONACTIVE',
          ].indexOf(value);
          if (statusPengajar < 0)
            throw new Error(
              'User role must be REGISTERED / WAITING / INTERVIEWED / REJECTED / ACTIVE / NONACTIVE]'
            );
          break;

        case USER_ROLE.PESERTA:
          const statusPeserta = [
            'REGISTERED',
            'ADMINISTRATION',
            'REJECTED',
            'ACTIVE',
            'NONACTIVE',
          ].indexOf(value);
          if (statusPeserta < 0)
            throw new Error(
              'User role must be REGISTERED / ADMINISTRATION / REJECTED / ACTIVE / NONACTIVE'
            );
          break;
      }

      return true;
    }),
];

const updateUserValidator = [
  check('role')
    .if(body('role').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['ADMIN', 'PENGAJAR', 'PESERTA'])
    .withMessage('User role must be ADMIN / PENGAJAR / PESERTA'),
  check('nama')
    .if(body('nama').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('email')
    .if(body('email').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isEmail()
    .withMessage('Must be in email format')
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
  check('usia')
    .if(body('usia').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be number contained only'),
  check('password')
    .if(body('password').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters'),
  check('phone')
    .if(body('phone').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .isNumeric()
    .withMessage('Must be number contained only'),
  check('status')
    .if(body('status').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
};

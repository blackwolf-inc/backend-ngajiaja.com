const { check, body } = require('express-validator');

const createJadwalMengajarValidator = [
  check('pengajar_id')
    .exists()
    .withMessage('Must have pengajar_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('hari_mengajar')
    .exists()
    .withMessage('Must have hari_mengajar')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'])
    .withMessage(`hari_mengajar must be SENIN / SELASA / RABU / KAMIS / JUMAT / SABTU / MINGGU`),
  check('mulai_mengajar')
    .exists()
    .withMessage('Must have mulai_mengajar')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('selesai_mengajar')
    .exists()
    .withMessage('Must have selesai_mengajar')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('status_libur')
    .exists()
    .withMessage('Must have status_libur')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer')
    .bail()
    .isIn([0, 1])
    .withMessage(`status_libur must be 0 / 1`),
];

const updateJadwalValidator = [
  check('pengajar_id')
    .if(body('pengajar_id').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('hari_mengajar')
    .if(body('hari_mengajar').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'])
    .withMessage(
      'User hari_mengajar must be SENIN / SELASA / RABU / KAMIS / JUMAT / SABTU / MINGGU'
    ),
  check('mulai_mengajar')
    .if(body('mulai_mengajar').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('selesai_mengajar')
    .if(body('selesai_mengajar').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('status_libur')
    .if(body('status_libur').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer')
    .bail()
    .isIn([0, 1])
    .withMessage('User status_libur must be 0 / 1'),
  check('status')
    .if(body('status').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['ACTIVE', 'INACTIVE'])
    .withMessage('Jadwal status must be ACTIVE / INACTIVE'),
];

module.exports = {
  createJadwalMengajarValidator,
  updateJadwalValidator,
};

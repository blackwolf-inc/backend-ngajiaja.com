const { check, body } = require('express-validator');

const getDataPengajarValidator = [
  check('hariBimbingan1')
    .exists()
    .withMessage('Must have hariBimbingan1')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'])
    .withMessage(`hariBimbingan1 must be SENIN / SELASA / RABU / KAMIS / JUMAT / SABTU / MINGGU`),
  check('hariBimbingan2')
    .exists()
    .withMessage('Must have hariBimbingan2')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'])
    .withMessage(`hariBimbingan2 must be SENIN / SELASA / RABU / KAMIS / JUMAT / SABTU / MINGGU`),
  check('jamBimbingan1')
    .exists()
    .withMessage('Must have jamBimbingan1')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('jamBimbingan2')
    .exists()
    .withMessage('Must have jamBimbingan2')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
];

module.exports = {
  getDataPengajarValidator,
};

const { check, body, checkExact } = require('express-validator');

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

const updateStatusPengajar = [
  check('status_pengajar')
    .exists()
    .withMessage('Must have status_pengajar')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['REGISTERED', 'WAITING', 'INTERVIEWED', 'REJECTED', 'ACTIVE', 'NONACTIVE'])
    .withMessage(
      `status_pengajar must be REGISTERED / WAITING / INTERVIEWED / REJECTED / ACTIVE / NONACTIVE`
    ),
  check('level_pengajar')
    .exists()
    .withMessage('Must have level_pengajar')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn(['MUBTADI', 'YUKHTABAR', 'BARIE'])
    .withMessage(`level_pengajar must be MUBTADI / YUKHTABAR / BARIE`),
  checkExact([body('status_pengajar'), body('level_pengajar')]),
];

const updateLinkWawancara = [
  check('link_wawancara')
    .exists()
    .withMessage('Must have link_wawancara')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  checkExact([body('link_wawancara')]),
];

const getPesertaPengajar = [
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
    .isIn(['REGISTERED', 'WAITING', 'INTERVIEWED', 'REJECTED', 'ACTIVE', 'NONACTIVE'])
    .withMessage(
      `status must be REGISTERED / WAITING / INTERVIEWED / REJECTED / ACTIVE / NONACTIVE`
    ),
  check('keyword')
    .exists()
    .withMessage('Must have keyword')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  checkExact([body('status'), body('keyword')]),
];

module.exports = {
  getDataPengajarValidator,
  updateStatusPengajar,
  updateLinkWawancara,
  getPesertaPengajar,
};

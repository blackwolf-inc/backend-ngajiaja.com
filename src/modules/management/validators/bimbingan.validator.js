const { check, body } = require('express-validator');

const updateBimbinganValidator = [
  check('tanggal')
    .if(body('tanggal').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('hari_bimbingan')
    .if(body('hari_bimbingan').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .isIn(['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'])
    .withMessage('hari_bimbingan must be SENIN / SELASA / RABU / KAMIS / JUMAT / SABTU / MINGGU'),
  check('jam_bimbingan')
    .if(body('jam_bimbingan').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('absensi_peserta')
    .if(body('absensi_peserta').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer')
    .isIn([0, 1])
    .withMessage('absensi_peserta must be 0 / 1'),
  check('absensi_pengajar')
    .if(body('absensi_pengajar').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer')
    .isIn([0, 1])
    .withMessage('User absensi_pengajar must be 0 / 1'),
  check('catatan_pengajar')
    .if(body('catatan_pengajar').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string / text'),
  check('keterangan_izin_peserta')
    .if(body('keterangan_izin_peserta').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string / text'),
  check('tanggal_pengingat_infaq')
    .if(body('tanggal_pengingat_infaq').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string / text'),
];

module.exports = {
  updateBimbinganValidator,
};

const { check, body } = require('express-validator');

const createStudentValidator = [
  check('user_id')
    .exists()
    .withMessage('Must have user_id')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('profesi')
    .exists()
    .withMessage('Must have profesi')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('bisa_baca_ayat')
    .exists()
    .withMessage('Must have bisa_baca_ayat')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn([
      'Belum bisa membaca Quran',
      'Bisa membaca Quran tapi terbata-bata',
      'Bisa membaca Quran dengan lancar',
      'Bisa membaca dan sedang menghafal Quran',
    ])
    .withMessage(
      'bisa_baca_ayat must be Belum bisa membaca Quran / Bisa membaca Quran tapi terbata-bata / Bisa membaca Quran dengan lancar / Bisa membaca dan sedang menghafal Quran'
    ),
  check('menguasai_ilmu_tajwid')
    .exists()
    .withMessage('Must have menguasai_ilmu_tajwid')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isIn([0, 1])
    .withMessage('menguasai_ilmu_tajwid must be 0 / 1'),
  check('paham_aplikasi_meet')
    .exists()
    .withMessage('Must have paham_aplikasi_meet')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('paham_aplikasi_meet must be 0 / 1'),
  check('siap_komitmen_mengaji')
    .exists()
    .withMessage('Must have siap_komitmen_mengaji')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('siap_komitmen_mengaji must be 0 / 1'),
  check('siap_komitmen_infak')
    .exists()
    .withMessage('Must have siap_komitmen_infak')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('siap_komitmen_infak must be 0 / 1'),
  check('bersedia_bayar_20K')
    .exists()
    .withMessage('Must have bersedia_bayar_20K')
    .bail()
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('bersedia_bayar_20K must be 0 / 1'),
];

const updateStudentValidator = [
  check('user_id')
    .if(body('user_id').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be integer'),
  check('profesi')
    .if(body('profesi').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string'),
  check('bisa_baca_ayat')
    .if(body('bisa_baca_ayat').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isString()
    .withMessage('Must be string')
    .bail()
    .isIn([
      'Belum bisa membaca Quran',
      'Bisa membaca Quran tapi terbata-bata',
      'Bisa membaca Quran dengan lancar',
      'Bisa membaca dan sedang menghafal Quran',
    ])
    .withMessage(
      `bisa_baca_ayat must be :
      1. Belum bisa membaca Quran 
      2. Bisa membaca Quran tapi terbata-bata 
      3. Bisa membaca Quran dengan lancar 
      4. Bisa membaca dan sedang menghafal Quran`
    ),
  check('menguasai_ilmu_tajwid')
    .if(body('menguasai_ilmu_tajwid').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('menguasai_ilmu_tajwid must be 0 / 1'),
  check('paham_aplikasi_meet')
    .if(body('paham_aplikasi_meet').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('paham_aplikasi_meet must be 0 / 1'),
  check('siap_komitmen_mengaji')
    .if(body('siap_komitmen_mengaji').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('siap_komitmen_mengaji must be 0 / 1'),
  check('siap_komitmen_infak')
    .if(body('siap_komitmen_infak').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('siap_komitmen_infak must be 0 / 1'),
  check('bersedia_bayar_20K')
    .if(body('bersedia_bayar_20K').exists())
    .notEmpty()
    .withMessage('Can not be empty')
    .bail()
    .isNumeric()
    .withMessage('Must be in integer')
    .bail()
    .isIn([0, 1])
    .withMessage('bersedia_bayar_20K must be 0 / 1'),
];

module.exports = {
  createStudentValidator,
  updateStudentValidator,
};

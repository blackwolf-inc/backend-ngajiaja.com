const { Router } = require('express');
const JadwalMengajar = require('./controllers/jadwalMengajar.controller');
const PilihPengajar = require('./controllers/pilihPengajar.controller');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const {
  createJadwalMengajarValidator,
  updateJadwalValidator,
} = require('./validators/jadwalPengajar.validator');

const {
  createPilihPengajarValidator,
  createTambahanValidator,
  updatePilihPengajarValidator,
} = require('./validators/pilihPengajar.validator');
const { USER_ROLE } = require('../../helpers/constanta');
const { hasRole } = require('../../middlewares/roleAuth');

router.get('/test', (req, res) => {
  res.send('test management');
});

// after login everything need to check auth
router.use(isAuthenticate);

// jadwal mengajar route
router.post(
  '/jadwal-pengajar',
  validate(createJadwalMengajarValidator),
  hasRole([USER_ROLE.PENGAJAR]),
  JadwalMengajar.create
);
router.get('/jadwal-pengajar', JadwalMengajar.getAll);
router.get('/jadwal-pengajar/:id', JadwalMengajar.getOne);
router.patch(
  '/jadwal-pengajar/:id',
  validate(updateJadwalValidator),
  hasRole([USER_ROLE.PENGAJAR]),
  JadwalMengajar.update
);
router.delete(
  '/jadwal-pengajar/:id',
  hasRole([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.PENGAJAR]),
  JadwalMengajar.delete
);

// pilih pengajar & buat bimbingan route
router.get('/bimbingan-pengajar', PilihPengajar.getAll);
router.post('/bimbingan-pengajar', validate(createPilihPengajarValidator), PilihPengajar.create);
router.patch(
  '/bimbingan-pengajar/:id',
  validate(updatePilihPengajarValidator),
  PilihPengajar.update
);
router.delete('/bimbingan-pengajar/:id', PilihPengajar.delete);

router.post(
  '/bimbingan-tambahan-pengajar',
  validate(createTambahanValidator),
  PilihPengajar.createTambahan
);
router.patch(
  '/bimbingan-tambahan-pengajar/:id',
  validate(createTambahanValidator),
  PilihPengajar.createTambahan
);

module.exports = router;

const { Router } = require('express');
const JadwalMengajar = require('./controllers/jadwalMengajar.controller');
const Bimbingan = require('./controllers/bimbingan.controller');
const PilihPengajar = require('./controllers/pilihPengajar.controller');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const {
  createJadwalMengajarValidator,
  updateJadwalValidator,
} = require('./validators/jadwalPengajar.validator');
const { updateBimbinganValidator } = require('./validators/bimbingan.validator');

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
  // hasRole([USER_ROLE.PENGAJAR]),
  JadwalMengajar.update
);
router.delete(
  '/jadwal-pengajar/:id',
  hasRole([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.PENGAJAR]),
  JadwalMengajar.delete
);

// pilih pengajar
router.get('/bimbingan-pengajar', PilihPengajar.getAll);

// bimbingan reguler
router.post('/bimbingan-pengajar', validate(createPilihPengajarValidator), PilihPengajar.create);
router.patch(
  '/bimbingan-pengajar/:id',
  validate(updatePilihPengajarValidator),
  PilihPengajar.update
);
router.delete('/bimbingan-pengajar/:id', PilihPengajar.delete);

// bimbingan tambahan
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

// Management Bimbingan Peserta & Pengajar
router.get('/bimbingan', Bimbingan.getDataBimbingan);
router.get('/bimbingan/pending', Bimbingan.getBimbinganPending);
router.get('/bimbingan/ongoing', Bimbingan.getBimbinganOnGoing);
router.get('/bimbingan/done', Bimbingan.getBimbinganDone);
router.get('/bimbingan/detail/:id', Bimbingan.getOneBimbingan);

// Management Bimbingan Peserta & Pengajar
router.patch('/bimbingan-reguler/:id', validate(updateBimbinganValidator), Bimbingan.updateReguler);
router.patch(
  '/bimbingan-tambahan/:id',
  validate(updateBimbinganValidator),
  Bimbingan.updateTambahan
);

// Read Bimbingan Peserta
router.get('/bimbingan-peserta', Bimbingan.getAllPeriodByPesertaId);
router.get('/bimbingan-peserta/:id', Bimbingan.getOnePeriodByPesertaId);

//Testendpoint
router.get('/testing-test/:id', PilihPengajar.update);

module.exports = router;

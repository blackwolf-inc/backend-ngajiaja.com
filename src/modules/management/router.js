const { Router } = require('express');
const JadwalMengajar = require('./controllers/jadwalMengajar.controller');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const {
  createJadwalMengajarValidator,
  updateJadwalValidator,
} = require('./validators/jadwalPengajar.validator');
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

module.exports = router;

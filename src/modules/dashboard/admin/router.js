const { Router } = require('express');
const router = Router();
const validate = require('../../../utils/validatorIndex');
const isAuthenticate = require('../../../middlewares/authentication');
const { USER_ROLE } = require('../../../helpers/constanta');
const { hasRole } = require('../../../middlewares/roleAuth');
const AdminDashboardController = require('./controllers/admin.controller.js');
const {
  updateStatusPengajar,
  updateLinkWawancara,
} = require('./validators/adminPengajar.validator');

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard admin',
  });
});

router.use(hasRole([USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN]));
router.get('/data/pengajar', AdminDashboardController.dataPengajar);
router.patch(
  '/data/pengajar/terdaftar/:userId',
  AdminDashboardController.updateWawancara
);
router.patch(
  '/data/pengajar/terverifikasi/:userId',
  AdminDashboardController.updateStatusPengajar
);

router.get('/data/pengajar/terdaftar', AdminDashboardController.getPengajarRegistered);
router.get('/data/pengajar/terverifikasi', AdminDashboardController.getPengajarVerified);

router.get('/data/peserta', AdminDashboardController.getAllDataPeserta);
router.get('/data/peserta/terdaftar', AdminDashboardController.getPesertaRegistered);
router.patch(
  '/data/peserta/terdaftar/:userId',
  AdminDashboardController.updateStatusPeserta
);

router.get('/data/peserta/terverifikasi', AdminDashboardController.getPesertaVerified);
router.patch(
  '/data/peserta/terverifikasi/:userId',
  AdminDashboardController.updateStatusPesertaVerified
);

router.get('/data/dashboard-admin', AdminDashboardController.getDataDashboardAdmin);
router.get('/data/dashboard-admin/bimbingan', AdminDashboardController.getAllBimbingan);

router.get('/data/period', AdminDashboardController.getAllCourse);
router.get('/data/period/ongoing', AdminDashboardController.getCourseOngoing);
router.get('/data/period/finished', AdminDashboardController.getCourseFinished);
router.get('/data/period/ongoing/:periodId', AdminDashboardController.getCourseOngoingById);
router.get('/data/period/finished/:periodId', AdminDashboardController.getCourseFinishedById);

module.exports = router;
const { Router } = require('express');
const router = Router();
const { USER_ROLE } = require('../../../helpers/constanta.js');
const { hasRole } = require('../../../middlewares/roleAuth.js');
const SuperAdminDashboardController = require('./controllers/superAdmin.controller.js');

router.get('/test', (req, res) => {
    res.status(200).json({
        message: 'test dashboard superadmin',
    });
});

router.use(hasRole([USER_ROLE.SUPER_ADMIN]));
router.get('/data/totalbimbingan', SuperAdminDashboardController.getAllDataSuperAdminDashboard);
router.get('/data/totaltransaksi', SuperAdminDashboardController.getDataSuperAdminDashboard);

router.get('/data/infaq', SuperAdminDashboardController.getDataInfaqAdmin);

router.get('/data/peserta', SuperAdminDashboardController.getDataPeserta);
router.get('/data/peserta/registered', SuperAdminDashboardController.getPesertaRegistered);
router.patch('/data/peserta/registered/:userId', SuperAdminDashboardController.updateStatusPeserta);
router.get('/data/peserta/verified', SuperAdminDashboardController.getPesertaVerified);
router.patch('/data/peserta/verified/:userId', SuperAdminDashboardController.updateStatusPeserta);

router.get('/data/pengajar', SuperAdminDashboardController.getDataPengajar);
router.get('/data/pengajar/registered', SuperAdminDashboardController.getPengajarRegistered);
router.patch('/data/pengajar/registered/:userId', SuperAdminDashboardController.updateStatusPengajarTerdaftar);
router.get('/data/pengajar/verified', SuperAdminDashboardController.getPengajarVerified);
router.patch('/data/pengajar/verified/:userId', SuperAdminDashboardController.updateStatusPengajar);

router.get('/export/peserta/registered/', SuperAdminDashboardController.getPesertaRegisteredExport);
router.get('/export/peserta/verified/', SuperAdminDashboardController.getPesertaVerifiedExport);

router.get('/export/pengajar/registered/', SuperAdminDashboardController.getPengajarRegisteredExport);
router.get('/export/pengajar/verified/', SuperAdminDashboardController.getPengajarVerifiedExport);

module.exports = router;
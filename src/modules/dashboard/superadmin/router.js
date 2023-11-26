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


module.exports = router;
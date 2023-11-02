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
  '/update/linkwawancara/:userId',
  validate(updateLinkWawancara),
  AdminDashboardController.updateWawancara
);
router.patch(
  '/update/statuspengajar/:userId',
  validate(updateStatusPengajar),
  AdminDashboardController.updateStatusPengajar
);

router.get('/data/pengajar/terdaftar', AdminDashboardController.getPengajarRegistered);

module.exports = router;

const { Router } = require('express');
const router = Router();
const validate = require('./../../../utils/validatorIndex');
const isAuthenticate = require('./../../../middlewares/authentication');
const { USER_ROLE } = require('../../../helpers/constanta');
const { hasRole } = require('../../../middlewares/roleAuth');
const AdminDashboardController = require('./controllers/admin.controller');
const { updateStatusPengajar } = require('./validators/adminPengajar.validator');

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard admin',
  });
});

router.get('/data/pengajar', AdminDashboardController.dataPengajar);
router.patch('/update/linkwawancara/:userId', AdminDashboardController.updateWawancara);
router.patch(
  '/update/statuspengajar/:userId',
  validate(updateStatusPengajar),
  AdminDashboardController.updateStatusPengajar
);

module.exports = router;

const { Router } = require('express');
const router = Router();
const { USER_ROLE } = require('../../../helpers/constanta');
const { hasRole } = require('../../../middlewares/roleAuth');
const PengajarDashboardController = require('./controllers/pengajar.controller');

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard pengajar',
  });
});

router.use(hasRole([USER_ROLE.PENGAJAR]));

// dashboard pengajar
router.get('/', PengajarDashboardController.getOne);
router.get('/bimbingan/pending', PengajarDashboardController.getBimbinganPending);
router.get('/bimbingan/ongoing', PengajarDashboardController.getBimbinganOnGoing);
router.get('/bimbingan/pending/filter', PengajarDashboardController.filterByName);
router.get('/bimbingan/ongoing/filter', PengajarDashboardController.filterByNameAndDate);
router.get('/total/bimbingan', PengajarDashboardController.getTotalBimbingan);
router.get('/total/absen', PengajarDashboardController.getTotalAbsent);
router.get('/total/income', PengajarDashboardController.getTotalIncome);

module.exports = router;

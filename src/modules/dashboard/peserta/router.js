const { Router } = require('express');
const router = Router();
const isAuthenticate = require('./../../../middlewares/authentication');
const { USER_ROLE } = require('../../../helpers/constanta');
const { hasRole } = require('../../../middlewares/roleAuth');
const DashboardPesertaController = require('./controllers/peserta.controller');
router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard peserta',
  });
});

router.use(hasRole([USER_ROLE.PESERTA]));
router.get('/data-bimbingan/:id', DashboardPesertaController.dataBimbingan);
router.get('/bimbingan-peserta/:id', DashboardPesertaController.bimbinganPeseta);

module.exports = router;

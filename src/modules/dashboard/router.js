const { Router } = require('express');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const { USER_ROLE } = require('../../helpers/constanta');
const { hasRole } = require('../../middlewares/roleAuth');
const adminRouter = require('./admin/router');
const pesertaRouter = require('./peserta/router');
const pengajarRouter = require('./pengajar/router');
const superAdminRouter = require('./superadmin/router')

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard',
  });
});

router.use(isAuthenticate);
router.use('/admin', adminRouter);
router.use('/peserta', pesertaRouter);
router.use('/pengajar', pengajarRouter);
router.use('/superadmin', superAdminRouter);

module.exports = router;

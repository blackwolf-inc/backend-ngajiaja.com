const { Router } = require('express');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const { USER_ROLE } = require('../../helpers/constanta');
const { hasRole } = require('../../middlewares/roleAuth');
const adminRouter = require('./admin/router');

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard',
  });
});

router.use(isAuthenticate);
router.use(hasRole([USER_ROLE.ADMIN]));

router.use('/admin', adminRouter);

module.exports = router;

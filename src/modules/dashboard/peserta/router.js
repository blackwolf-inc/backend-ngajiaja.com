const { Router } = require('express');
const router = Router();
const isAuthenticate = require('./../../../middlewares/authentication');
const { USER_ROLE } = require('../../../helpers/constanta');
const { hasRole } = require('../../../middlewares/roleAuth');
const DashboardPesertaController = require('./controllers/peserta.controller');
const ProfilePesertaController = require('./controllers/profile-peserta.controllers');
const validate = require('./../../../utils/validatorIndex');
const updateProfileValidator = require('./validation/profile-peserta.validator');
const storageImage = require('../../../utils/storageImage');

router.get('/test', (req, res) => {
  res.status(200).json({
    message: 'test dashboard peserta',
  });
});

router.use(hasRole([USER_ROLE.PESERTA]));
router.get('/data-bimbingan/:id', DashboardPesertaController.dataBimbingan);
router.get('/bimbingan-peserta/:id', DashboardPesertaController.bimbinganPeseta);
router.get('/profile/:id', ProfilePesertaController.getOne);
router.put(
  '/profile/:id',
  storageImage.image.single('media'),
  validate(updateProfileValidator),
  ProfilePesertaController.update
);

module.exports = router;

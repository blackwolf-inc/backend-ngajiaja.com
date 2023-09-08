const { Router } = require('express');
const BankController = require('./controllers/bank.controller');
const BiayaAdministrasiPesertaController = require('./controllers/biayaAdminPeserta.controller');
const storageImage = require('../../utils/storageImage');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const { createBankValidator } = require('./validators/bank.validator');
const cost = require('./validators/biayaAdminPeserta.validator');

router.get('/test', (req, res) => {
  res.send('test monetary');
});
// biaya administrasi peserta route

// after login everything need to check auth
router.use(isAuthenticate);

// bank route
router.get('/bank', BankController.getAll);
router.get('/bank/:id', BankController.getOne);
router.post('/bank', validate(createBankValidator), BankController.create);

router.get('/biaya-administrasi-peserta', BiayaAdministrasiPesertaController.getAll);
router.post(
  '/biaya-administrasi-peserta',
  storageImage.image.single('media'),
  validate(cost.createBiayaAdminPesertaValidator),
  BiayaAdministrasiPesertaController.create
);
router.patch(
  '/biaya-administrasi-peserta/:id',
  storageImage.image.single('media'),
  validate(cost.updateBiayaAdminPesertaValidator),
  BiayaAdministrasiPesertaController.update
);
module.exports = router;

const { Router } = require('express');
const BankController = require('./controllers/bank.controller');
const PencairanController = require('./controllers/pencairan.controller');
const PenghasilanController = require('./controllers/penghasilan.controller');
const BiayaAdministrasiPesertaController = require('./controllers/biayaAdminPeserta.controller');
const InfaqController = require('./controllers/infaq.controller');
const storageImage = require('../../utils/storageImage');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const { createBankValidator, updateBankValidator } = require('./validators/bank.validator');
const {
  createPencairanValidator,
  updatePencairanValidator,
} = require('./validators/pencairan.validator');
const cost = require('./validators/biayaAdminPeserta.validator');
const infaqValidator = require('./validators/infaq.validator');

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
router.patch('/bank/:id', validate(updateBankValidator), BankController.update);
router.delete('/bank/:id', BankController.delete);
router.get('/pengajar/bank', BankController.getPengajarBank);
router.patch('/pengajar/bank', BankController.updatePengajarBank);

// biaya peserta route
router.get('/biaya-administrasi-peserta', BiayaAdministrasiPesertaController.getAll);
router.get('/biaya-administrasi-peserta/one', BiayaAdministrasiPesertaController.getOne);
router.post(
  '/biaya-administrasi-peserta',
  storageImage.image.single('media'),
  validate(cost.createBiayaAdminPesertaValidator),
  BiayaAdministrasiPesertaController.create,
);
router.patch(
  '/biaya-administrasi-peserta/:id',
  storageImage.image.single('media'),
  validate(cost.updateBiayaAdminPesertaValidator),
  BiayaAdministrasiPesertaController.update,
);

// pencairan route
router.get('/pencairan', PencairanController.getAll);
router.get('/pencairan/:id', PencairanController.getOne);
router.post('/pencairan', validate(createPencairanValidator), PencairanController.create);
router.patch(
  '/pencairan/:id',
  storageImage.image.single('media'),
  validate(updatePencairanValidator),
  PencairanController.update,
);
router.delete('/pencairan/:id', PencairanController.delete);

// infaq route
router.get('/infaq', InfaqController.getAll);
router.get('/infaq/:id', InfaqController.getOne);
router.post(
  '/infaq',
  storageImage.image.single('media'),
  validate(infaqValidator.createInfaqValidator),
  InfaqController.create,
);
router.patch('/infaq/images/:id', storageImage.image.single('media'), InfaqController.updateImages);
router.patch('/infaq/:id', validate(infaqValidator.updateInfaqValidator), InfaqController.update);
router.delete('/infaq/:id', InfaqController.delete);

// penghasilan route
router.get('/penghasilan', PenghasilanController.getIncome);
router.get('/penghasilan/detail', PenghasilanController.dataIncome);

module.exports = router;

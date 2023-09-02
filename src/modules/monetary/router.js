const { Router } = require('express');
const BankController = require('./controllers/bank.controller');
const router = Router();
const validate = require('./../../utils/validatorIndex');
const isAuthenticate = require('./../../middlewares/authentication');
const { createBankValidator } = require('./validators/bank.validator');

router.get('/test', (req, res) => {
  res.send('test monetary');
});

// after login everything need to check auth
router.use(isAuthenticate);

// bank route
router.get('/bank', BankController.getAll);
router.get('/bank/:id', BankController.getOne);
router.post('/bank', validate(createBankValidator), BankController.create);

module.exports = router;

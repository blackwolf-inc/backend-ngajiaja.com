const { Router } = require('express');
const AuthController = require('./controllers/auth.controller');
const isAuthenticate = require('./../../middlewares/authentication');
const validate = require('./../../utils/validatorIndex');
const {
  reqResetPasswordValidator,
  resetPasswordValidator,
} = require('./validators/auth.validator');

const router = Router();

router.get('/test', (req, res) => {
  res.send('test auth');
});

router.post('/login', AuthController.login);
router.post('/logout', isAuthenticate, AuthController.logout);
router.post(
  '/request-reset-password',
  validate(reqResetPasswordValidator),
  AuthController.requestResetPassword
);
router.post('/reset-password', validate(resetPasswordValidator), AuthController.resetPassword);

router.post('/change-password', isAuthenticate, AuthController.changePassword);

module.exports = router;

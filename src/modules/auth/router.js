const { Router } = require('express');
const AuthController = require('./controllers/auth.controller');

const router = Router();

router.get('/test', (req, res) => {
  res.send('test auth');
});

router.post('/login', AuthController.login);
// router.post("/logout", isAuthenticate, logout);
// router.post("/request-reset-password", validate(reqResetPasswordValidator), requestResetPassword);
// router.post("/reset-password/:token", validate(resetPasswordValidator), resetPassword);

module.exports = router;

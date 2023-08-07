const { Router } = require('express');
// const login = require("./controllers/login");
// const logout = require("./controllers/logout");
// const validate = require("./../../utils/validatorIndex");
// const loginValidator = require("./validators/loginValidator");
// const isAuthenticate = require("../../middleware/authentication");
// const { requestResetPassword, resetPassword } = require("./controllers/resetPassword");
// const resetPasswordValidator = require("./validators/resetPasswordValidator");
// const reqResetPasswordValidator = require("./validators/reqResetPasswordValidator");

const router = Router();

router.get('/test', (req, res) => {
  res.send('test auth');
});

// router.post("/login", validate(loginValidator), login);
// router.post("/logout", isAuthenticate, logout);
// router.post("/request-reset-password", validate(reqResetPasswordValidator), requestResetPassword);
// router.post("/reset-password/:token", validate(resetPasswordValidator), resetPassword);

module.exports = router;

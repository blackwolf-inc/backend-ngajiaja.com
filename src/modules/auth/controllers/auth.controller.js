const ApiError = require('../../../helpers/errorHandler');
const { checkHash, getHash } = require('../../../helpers/passwordHash');
const UserService = require('../../registration/services/user.service');
const AuthService = require('../../auth/services/auth.service');
const jwt = require('jsonwebtoken');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { User, UserResetPassword, sequelize } = db;

class AuthController {
  static async login(req, res, next) {
    const service = new UserService(req, User);
    try {
      const { email, password } = req.body;

      const user = await service.getUserByEmail(email);

      if (!checkHash(password, user.password)) {
        throw ApiError.badRequest('Your password is wrong');
      }

      const payload = {
        id: user.id,
        role: user.role,
        nama: user.nama,
        email: user.email,
        telp_wa: user.telp_wa,
        jenis_kelamin: user.jenis_kelamin,
        alamat: user.alamat,
        usia: user.usia,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2d' });
      await service.updateData({ token }, { id: user.id });

      return responseHandler.succes(res, 'Login success', {
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    const service = new UserService(req, User);
    try {
      await service.updateData({ token: null }, { id: req.user.id });
      return responseHandler.succes(res, 'logout success');
    } catch (err) {
      next(err);
    }
  }

  static async requestResetPassword(req, res, next){
    const service = new AuthService(req, UserResetPassword);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getUserByEmail(req.body.email);
      req.body.user = user;
      const result = await service.generateResetPasswordToken(req);
      return responseHandler.succes(res, `Success`, result);
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next){
    const service = new AuthService(req, UserResetPassword);
    const userService = new UserService(req, User);
    try {
      const token = await service.getDetailByToken(req.body.token);
      req.body.password = getHash(req.body.password);
      const user = await userService.updateData({ password: req.body.password }, { id: token.user_id });
      await service.removeUserToken(user.id);
      delete user.password;
      delete user.token;
      return responseHandler.succes(res, `Success`, user);
    } catch (err) {
      next(err);
    }

  }
}

module.exports = AuthController;

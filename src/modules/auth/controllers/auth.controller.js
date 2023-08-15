const ApiError = require('../../../helpers/errorHandler');
const { checkHash } = require('../../../helpers/passwordHash');
const UserService = require('../../registration/services/user.service');
const jwt = require('jsonwebtoken');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { User, sequelize } = db;

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
}

module.exports = AuthController;

const { formatDateLocal } = require('../../../../helpers/dateConverter');
const { getHash } = require('../../../../helpers/passwordHash');
const UserService = require('../services/profile-peserta.service');
const responseHandler = require('./../../../../helpers/responseHandler');
const db = require('./../../../../models/index');
const { User, sequelize } = db;
const nodemailer = require('nodemailer');

class UserController {
  static async getOne(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getOneUser(req.params.id);
      delete result.password;
      delete result.token;
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new UserService(req, User);
    try {
      if (req.body.tgl_lahir) {
        req.body.tgl_lahir = formatDateLocal(req.body.tgl_lahir);
      }
      await service.updateImages(req);
      const result = await service.updateUserData(req.body, { id: req.params.id });
      delete result.password;
      delete result.token;
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;

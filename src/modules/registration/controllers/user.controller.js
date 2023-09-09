const { formatDateLocal } = require('../../../helpers/dateConverter');
const { getHash } = require('../../../helpers/passwordHash');
const UserService = require('../services/user.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { User, sequelize } = db;
const nodemailer = require('nodemailer');

class UserController {
  static async getOne(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getOneById(req.params.id);
      delete result.password;
      delete result.token;
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getAll();
      for (const data of result.datas) {
        delete data.password;
        delete data.token;
      }
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new UserService(req, User);
    try {
      const body = await UserController.#bodyHandler(req.body);
      await service.checkIsEmailExist(body.email);
      const result = await service.createData(body);
      delete result.password;
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    /* can not use bodyHandler since need to update partially */
    const service = new UserService(req, User);
    try {
      if (req.body.password) {
        req.body.password = getHash(req.body.password);
      }
      if (req.body.tgl_lahir) {
        req.body.tgl_lahir = formatDateLocal(req.body.tgl_lahir);
      }

      const result = await service.updateUserData(req.body, { id: req.params.id });
      delete result.password;
      delete result.token;
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new UserService(req, User);
    try {
      await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`);
    } catch (error) {
      next(error);
    }
  }

  static async #bodyHandler(body) {
    return {
      role: body.role,
      nama: body.nama,
      email: body.email,
      telp_wa: body.telp_wa,
      jenis_kelamin: body.jenis_kelamin,
      alamat: body.alamat,
      tgl_lahir: formatDateLocal(body.tgl_lahir),
      status: body.status,
      password: getHash(body.password),
      token: body.token,
    };
  }
}

module.exports = UserController;

const UserService = require('../services/user.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { User, sequelize } = db;

class UserController {
  static async getOne(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getOneById(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.getAll();
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.createData(req.body);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new UserService(req, User);
    try {
      const result = await service.updateData(req.body, { id: req.params.id });
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
}

module.exports = UserController;

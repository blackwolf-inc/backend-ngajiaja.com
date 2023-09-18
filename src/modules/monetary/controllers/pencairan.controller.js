const PencairanService = require('../service/pencairan.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { Pencairan, sequelize } = db;

class PencairanController {
  static async getOne(req, res, next) {
    const service = new PencairanService(req, Pencairan);
    try {
      const result = await service.getOneById(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new PencairanService(req, Pencairan);
    const user = req.user;
    try {
      const result = await service.getAllPencairanByUserId(user.id);
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new PencairanService(req, Pencairan);
    try {
      await Promise.all([
        await service.checkUserById(req.body),
        await service.checkUserById(req.body),
      ]);
      const result = await service.createData(req.body);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new PencairanService(req, Pencairan);
    try {
      await service.checkPencairanById(req.params.id);
      await service.changeImages(req);
      await service.updateDateNow(req);
      const result = await service.updateData(req.body, { id: req.params.id });
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new PencairanService(req, Pencairan);
    try {
      const result = await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PencairanController;

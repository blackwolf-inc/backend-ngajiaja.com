const BiayaAdminPesertaService = require('../service/biayaAdminPeserta.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { BiayaAdministrasi } = db;

class StudentController {
  static async getAll(req, res, next) {
    const service = new BiayaAdminPesertaService(req, BiayaAdministrasi);
    try {
      const result = await service.getAll();
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    const service = new BiayaAdminPesertaService(req, BiayaAdministrasi);
    try {
      const result = await service.getOneIncludeDate(req);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new BiayaAdminPesertaService(req, BiayaAdministrasi);
    try {
      await service.checkUserId(req);
      await service.checkBankId(req);
      await service.checkDuplicateUserId(req);
      await service.changeImages(req);
      const result = await service.createData(req.body);
      await service.updateUser(req);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new BiayaAdminPesertaService(req, BiayaAdministrasi);
    try {
      await service.checkUserId(req);
      await service.checkBankId(req);
      await service.changeImages(req);
      const result = await service.updateData(req.body, { id: req.params.id });
      await service.updateUser(req);
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentController;

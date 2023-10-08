const BankService = require('../service/bank.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { Bank } = db;

class BankController {
  static async getOne(req, res, next) {
    const service = new BankService(req, Bank);
    try {
      const result = await service.getOneById(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new BankService(req, Bank);
    try {
      const result = await service.getAll();
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new BankService(req, Bank);
    try {
      await service.checkBankDuplicate(req.body.nama_bank);
      const result = await service.createData(req.body);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new BankService(req, Bank);
    try {
      const result = await service.updateBank(req.body, req.params.id);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new BankService(req, Bank);
    try {
      const result = await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BankController;

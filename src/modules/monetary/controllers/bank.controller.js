const BankService = require('../service/bank.service');
const UserService = require('../../registration/services/user.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { Bank, Pengajar, User } = db;

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

  static async getPengajarBank(req, res, next) {
    const service = new BankService(req, Pengajar);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.getPengajarBank(user.pengajar.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePengajarBank(req, res, next) {
    const service = new BankService(req, Pengajar);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.updateData(req.body, { id: user.pengajar.id });
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BankController;

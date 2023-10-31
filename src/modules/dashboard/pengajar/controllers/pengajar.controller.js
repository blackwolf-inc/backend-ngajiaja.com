const PengajarService = require('../services/pengajar.service');
const UserService = require('../../../registration/services/user.service');
const responseHandler = require('../../../../helpers/responseHandler');
const { Pengajar, Period, User } = require('../../../../models');

class PengajarController extends PengajarService {
  static async getOne(req, res, next) {
    const service = new PengajarService(req, Pengajar);
    try {
      const result = await service.getPengajarByUserId(req.user.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganPending(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.bimbinganPending(user.pengajar.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganOnGoing(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.bimbinganOnGoing(user.pengajar.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async filterByName(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.filterPesertaByName(user.pengajar.id, req.query.name);
      return responseHandler.succes(res, `Success get filtered ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async filterByNameAndDate(req, res, next) {}

  static async getTotalBimbingan(req, res, next) {}

  static async getTotalIncome(req, res, next) {}
}

module.exports = PengajarController;

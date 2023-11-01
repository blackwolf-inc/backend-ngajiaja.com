const PengajarService = require('../services/pengajar.service');
const UserService = require('../../../registration/services/user.service');
const responseHandler = require('../../../../helpers/responseHandler');
const { Pengajar, Period, User, Infaq } = require('../../../../models');

class PengajarController extends PengajarService {
  static async getOne(req, res, next) {
    const service = new PengajarService(req, Pengajar);
    const periodService = new PengajarService(req, Period);
    const infaqService = new PengajarService(req, Infaq);
    try {
      const pengajar = await service.getPengajarByUserId(req.user.id);
      const [totalBimbingan, totalAbsent, totalIncome] = await Promise.all([
        await periodService.getBimbinganActivated(pengajar.id),
        await periodService.getAbsent(pengajar.id),
        await infaqService.getIncome(pengajar.id),
      ]);
      return responseHandler.succes(res, `Success get ${service.db.name}`, {
        pengajar,
        total_bimbingan: totalBimbingan,
        total_absent: totalAbsent,
        total_income: totalIncome,
      });
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
      return responseHandler.succes(res, `Success get bimbingan menunggu`, result);
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
      return responseHandler.succes(res, `Success get bimbingan akan datang`, result);
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
      return responseHandler.succes(res, `Success get filtered peserta`, result);
    } catch (error) {
      next(error);
    }
  }

  static async filterByNameAndDate(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.filterPesertaByNameAndDate(
        user.pengajar.id,
        req.query.name,
        req.query.date,
      );
      return responseHandler.succes(res, `Success get filtered peserta`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PengajarController;

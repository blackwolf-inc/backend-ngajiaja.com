const PengajarService = require('../services/pengajar.service');
const UserService = require('../../../registration/services/user.service');
const PenghasilanPengajarService = require('../../../monetary/service/penghasilan.service');
const responseHandler = require('../../../../helpers/responseHandler');
const { Pengajar, Period, User, PenghasilanPengajar } = require('../../../../models');

class PengajarController {
  static async getOne(req, res, next) {
    const service = new PengajarService(req, Pengajar);
    const periodService = new PengajarService(req, Period);
    const penghasilanService = new PenghasilanPengajarService(req, PenghasilanPengajar);
    try {
      const pengajar = await service.getPengajarByUserId(req.user.id);
      const [totalBimbingan, totalAbsent, totalIncome] = await Promise.all([
        periodService.getBimbinganActivated(pengajar.id),
        periodService.getAbsent(pengajar.id),
        penghasilanService.totalIncome(pengajar.id),
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
      const result = await service.bimbinganPending(user.pengajar.id, req.query.name);
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
      const result = await service.bimbinganOnGoing(
        user.pengajar.id,
        req.query.name,
        req.query.status,
      );
      return responseHandler.succes(res, `Success get bimbingan akan datang`, result);
    } catch (error) {
      next(error);
    }
  }

  static async postDataRekening(req, res, next) {
    const service = new PengajarService(req, Pengajar);
    try {
      const pengajar = await service.getPengajarByUserId(req.user.id);
      const result = await service.postDataRekening(pengajar.id, req.body);
      return responseHandler.succes(res, `Success post data rekening`, result);
    } catch (error) {
      next(error);
    }
  }

  static async postPencairanPengajar(req, res, next) {
    const pengajarService = new PengajarService(req, Pengajar);
    try {

      const result = await pengajarService.postPencairanPengajar(req.body);

      return res.status(201).json({ message: 'Success post pencairan', data: result });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = PengajarController;

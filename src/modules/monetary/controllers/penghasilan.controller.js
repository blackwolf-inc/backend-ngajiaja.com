const PenghasilanService = require('../service/penghasilan.service');
const PencairanService = require('../service/pencairan.service');
const UserService = require('../../registration/services/user.service');
const responseHandler = require('../../../helpers/responseHandler');
const { PenghasilanPengajar, Pencairan, User } = require('../../../models');

class PenghasilanController {
  static async getIncome(req, res, next) {
    const service = new PenghasilanService(req, PenghasilanPengajar);
    const userService = new UserService(req, User);
    const { id } = req.user;
    const { startDate, endDate, pesertaName, percent } = req.query;
    try {
      const user = await userService.getOneUser(id);
      const result = await service.dataIncome(
        user.pengajar.id,
        startDate,
        endDate,
        pesertaName,
        percent,
      );
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async dataIncome(req, res, next) {
    const service = new PenghasilanService(req, PenghasilanPengajar);
    const pencairanService = new PencairanService(req, Pencairan);
    const userService = new UserService(req, User);
    const { id } = req.user;
    try {
      const user = await userService.getOneUser(id);
      const [totalIncome, totalPencairan] = await Promise.all([
        service.totalIncome(user.pengajar.id),
        pencairanService.totalPencairan(id),
      ]);

      return responseHandler.succes(res, `Success get ${service.db.name}`, {
        total_income: totalIncome,
        total_pencairan: totalPencairan,
        saldo: totalIncome - totalPencairan,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PenghasilanController;

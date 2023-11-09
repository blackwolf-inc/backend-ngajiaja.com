const PenghasilanService = require('../service/penghasilan.service');
const PencairanService = require('../service/pencairan.service');
const responseHandler = require('../../../helpers/responseHandler');
const { PenghasilanPengajar, Pencairan } = require('../../../models');

class PenghasilanController {
  static async getIncome(req, res, next) {
    const service = new PenghasilanService(req, PenghasilanPengajar);
    const { id } = req.user;
    const { startDate, endDate, pesertaName, persen } = req.query;
    try {
      const result = await service.dataIncome(id, startDate, endDate, pesertaName, persen);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async dataIncome(req, res, next) {
    const service = new PenghasilanService(req, PenghasilanPengajar);
    const pencairanService = new PencairanService(req, Pencairan);
    const { id } = req.user;
    try {
      const [totalIncome, totalPencairan] = await Promise.all([
        service.totalIncome(id),
        pencairanService.totalPencairan(id),
      ]);

      return {
        totalIncome,
        totalPencairan,
        saldo: totalIncome - totalPencairan,
      };
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PenghasilanController;

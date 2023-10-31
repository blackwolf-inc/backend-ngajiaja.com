const DashboardPesertaService = require('../services/dashboardPeserta.service');
const responseHandler = require('./../../../../helpers/responseHandler');
const db = require('../../../../models/index');
const { Period } = db;

class PesertaDashboardController {
  static async dataBimbingan(req, res, next) {
    const service = new DashboardPesertaService();
    try {
      const result = await service.getDataBimbingan(req.params.id);
      return responseHandler.succes(res, 'Success get data bimbingan', result);
    } catch (error) {
      next(error);
    }
  }
  static async bimbinganPeseta(req, res, next) {
    const service = new DashboardPesertaService(req, Period);
    try {
      const result = await service.getBimbinganPeserta(req.params.id, req.query);
      return responseHandler.succes(res, 'Success get data bimbingan peserta', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PesertaDashboardController;

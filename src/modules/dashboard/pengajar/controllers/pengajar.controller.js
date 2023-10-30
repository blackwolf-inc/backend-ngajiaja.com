const PengajarService = require('../services/pengajar.service');
const responseHandler = require('../../../../helpers/responseHandler');
const { Pengajar, Period } = require('../../../../models');

class PengajarController extends PengajarService {
  static async getOne(req, res, next) {
    const service = new PengajarService(req, Pengajar);
    try {
      const result = await service.getPengajarByUserId(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganPending(req, res, next) {
    const service = new PengajarService(req, Period);
    try {
      const result = await service.getBimbinganWaiting(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganOnGoing(req, res, next) {}

  static async filterByName(req, res, next) {
    const service = new PengajarService(req, Period);
    try {
      const result = await service.filterPesertaByName(req.params.id, req.body.name);
      return responseHandler.succes(res, `Success get filtered ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PengajarController;

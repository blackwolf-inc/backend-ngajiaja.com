const BimbinganService = require('../service/bimbingan.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { Period, BimbinganReguler } = db;

class BimbinganPeserta {
  static async getAll(req, res, next) {
    const service = new BimbinganService(req, Period);
    try {
      const result = await service.getAllPeriod(req.query);

      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req, res, next) {
    const service = new BimbinganService(req, Period);
    try {
      const result = await service.getOnePeriod(req.params.id);

      return responseHandler.succes(res, `Success get ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async updateReguler(req, res, next) {
    const service = new BimbinganService(req, BimbinganReguler);
    try {
      const result = await service.updateData(req.body, { id: req.params.id });
      return responseHandler.succes(res, `Success update data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BimbinganPeserta;

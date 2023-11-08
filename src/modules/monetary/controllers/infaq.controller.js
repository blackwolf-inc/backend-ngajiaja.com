const InfaqService = require('../service/infaq.service');
const PesertaService = require('../../registration/services/student.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { Infaq, Peserta, sequelize } = db;

class InfaqController {
  static async getOne(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      const result = await service.getOneById(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new InfaqService(req, Infaq);
    const user = req.user;
    try {
      let userData = {};
      // const user = {
      //   id: 23,
      //   role: 'PENGAJAR',
      // };
      if (user.role == 'PESERTA') {
        userData = await service.getPesertaByUserId(user.id);
      } else {
        userData = await service.getPengajarByUserId(user.id);
      }

      const result = await service.getAllInfaqByUserId(userData.id, user.role, req.query);
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      await Promise.all([
        service.checkPesertaById(req.body),
        service.checkPengajarById(req.body),
        service.checkPeriodById(req.body),
        service.checkBankById(req.body),
        service.updateDateNow(req),
      ]);
      const result = await service.createData(req.body);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      await service.checkInfaqById(req.params.id);
      const result = await service.updateData(req.body, { id: req.params.id });
      if (result) {
        await service.addToPenghasilanPengajar(result);
        return responseHandler.succes(res, `Success create ${service.db.name}`, result);
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateImages(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      await service.checkInfaqById(req.params.id);
      await service.updateImages(req);
      const result = await service.updateData(req.body, { id: req.params.id });
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      const result = await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InfaqController;

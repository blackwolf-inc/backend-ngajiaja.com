const InfaqService = require('../service/infaq.service');
const PesertaService = require('../../registration/services/student.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { use } = require('chai');
const { Infaq, PenghasilanPengajar } = db;

class InfaqController {
  static async getOne(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      const result = await service.getOneInfaqById(req.params.id);
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
    const user = req.user;
    try {
      console.log(user.id);
      await Promise.all([
        service.checkPesertaById(user.id),
        service.checkPengajarById(req.body),
        service.checkPeriodById(req.body),
        service.checkBankById(req.body),
        service.updateDateNow(req),
        service.insertImages(req),
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
      await Promise.all([
        await service.checkInfaqById(req.params.id),
        await service.updateImages(req),
      ]);
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

  static async updateInfaqAdmin(req, res, next) {
    const service = new InfaqService(req, Infaq);
    try {
      const { status, keterangan } = req.body;
      const { id } = req.params;
      await Infaq.update(
        { status, keterangan },
        {
          where: {
            id,
          },
        }
      );

      const infaqdata = await Infaq.findByPk(id);
      if (status === 'ACCEPTED') {
        const existingRecord = await PenghasilanPengajar.findOne({
          where: {
            periode_id: infaqdata.periode_id,
          },
        });

        if (existingRecord) {
          return responseHandler.succes(res, `Success update infaq ${service.db.name}`, infaqdata);
        }
        await service.updateInfaqAdmin(infaqdata);
        return responseHandler.succes(
          res,
          `Success add to penghasilan pengajar ${service.db.name}`,
          infaqdata
        );
      } else {
        return responseHandler.succes(res, `Success update infaq ${service.db.name}`, infaqdata);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InfaqController;

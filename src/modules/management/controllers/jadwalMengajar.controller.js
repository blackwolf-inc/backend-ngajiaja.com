const JadwalMengajarService = require('../service/jadwalMengajar.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { USER_ROLE } = require('../../../helpers/constanta');
const ApiError = require('../../../helpers/errorHandler');
const { JadwalMengajarPengajar, sequelize } = db;

class JadwalMengajar {
  static async getOne(req, res, next) {
    const service = new JadwalMengajarService(req, JadwalMengajarPengajar);
    try {
      const result = await service.getOneById(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new JadwalMengajarService(req, JadwalMengajarPengajar);
    const user = req.user;
    try {
      if (user.role !== USER_ROLE.PENGAJAR) {
        throw ApiError.badRequest(`User's role is mot ${USER_ROLE.PENGAJAR}`);
      }
      await Promise.all([
        service.checkJadwalDuplicate(req.body),
        service.checkJadwalOverlap(req.body),
      ]);
      const result = await service.createJadwalMengajar(req.body);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new JadwalMengajarService(req, JadwalMengajarPengajar);
    const user = req.user;
    try {
      const teacher_id = await service.checkTeacherId(user.id);
      const result = await service.getAllByPengajarId(teacher_id.dataValues.id);
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new JadwalMengajarService(req, JadwalMengajarPengajar);
    try {
      await service.checkJadwalId(req.params.id);

      await service.checkJadwalDuplicate(req.body);
      await service.checkJadwalOverlap(req.body);

      const result = await service.updateData(req.body, req.params.id);
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new JadwalMengajarService(req, JadwalMengajar);
    try {
      await service.checkJadwalId(req.params.id);
      await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JadwalMengajar;

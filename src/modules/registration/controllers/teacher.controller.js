const TeacherService = require('../services/teacher.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { Pengajar, sequelize } = db;
const { USER_ROLE } = require('./../../../helpers/constanta');
const ApiError = require('../../../helpers/errorHandler');
class TeacherController {
  static async getOne(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      const result = await service.getTeacherByUserId(req.params.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      const result = await service.getAll();
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      const [userExist, _] = await Promise.all([
        service.checkUser(req.body.user_id),
        service.checkTeacherDuplicate(req.body.user_id),
      ]);
      if (userExist.dataValues.role !== USER_ROLE.PENGAJAR) {
        throw ApiError.badRequest(`User's role is not PENGAJAR`);
      }

      const result = await service.createTeacher(req.body);
      service.sendNotificationEmail(userExist.email, userExist.nama);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      if (req.body.tanggal_wawancara) {
        await service.updateStatusUserWhenInterviewSet(req.params.id);
      }
      const result = await service.updateTeacherByUserId(req.body, req.params.id);
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      const result = await service.deleteTeacherByUserId(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;

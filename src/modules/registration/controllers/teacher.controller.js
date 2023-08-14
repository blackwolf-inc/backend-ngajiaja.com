const TeacherService = require('../services/teacher.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { Pengajar, sequelize } = db;

class TeacherController {
  static async getOne(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      const result = await service.getOneById(req.params.id);
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
    const validation = await service.inputValidation(req);

    if (!validation) return responseHandler.error(res, 'Validation failed', validation);

    try {
      const userExist = await service.checkUser(req.body.user_id);
      await service.checkTeacherDuplicate(req.body.user_id);

      // await service.sendNotificationEmail(userExist.email, userExist.nama); //Belum setup cpanel

      const result = await service.createData(req.body);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      await service.getOneById(req.params.id);
      const result = await service.updateData(req.body, { id: req.params.id });
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    try {
      await service.getOneById(req.params.id);
      await service.deleteData(req.params.id);
      return responseHandler.succes(res, `Success delete ${service.db.name}`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;

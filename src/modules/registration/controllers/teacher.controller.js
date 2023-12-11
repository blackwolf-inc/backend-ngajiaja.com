const TeacherService = require('../services/teacher.service');
const UserService = require('../services/user.service');
const PenghasilanService = require('../../monetary/service/penghasilan.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { Pengajar, User, PenghasilanPengajar, Pencairan, sequelize } = db;
const { USER_ROLE } = require('./../../../helpers/constanta');
const ApiError = require('../../../helpers/errorHandler');
const PencairanService = require('../../monetary/service/pencairan.service');
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

  static async getPengajarProfile(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    const userService = new UserService(req, User);
    const penghasilanService = new PenghasilanService(req, PenghasilanPengajar);
    const pencairanService = new PencairanService(req, Pencairan);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.getPengajarProfile(user.pengajar.id);
      const [totalIncome, totalPencairan] = await Promise.all([
        penghasilanService.totalIncome(user.pengajar.id),
        pencairanService.totalPencairan(req.user.id),
      ]);
      result.saldo = totalIncome - totalPencairan;
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePengajarProfile(req, res, next) {
    const service = new TeacherService(req, Pengajar);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.updatePengajarProfile(req, req.body, user.pengajar.id);
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeacherController;

const { USER_ROLE } = require('../../../helpers/constanta');
const ApiError = require('../../../helpers/errorHandler');
const StudentService = require('../services/student.service');
const UserService = require('../services/user.service');
const responseHandler = require('./../../../helpers/responseHandler');
const db = require('./../../../models/index');
const { Peserta, sequelize, JadwalBimbinganPeserta, User } = db;

class StudentController {
  static async getOne(req, res, next) {
    const service = new StudentService(req, Peserta);
    try {
      const result = await service.getStudentByUserId(req);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    const service = new StudentService(req, Peserta);
    try {
      const result = await service.getAll();
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    const service = new StudentService(req, Peserta);
    try {
      const [userExist, _] = await Promise.all([
        service.checkUserId(req),
        service.checkDuplicateUserId(req),
      ]);
      if (userExist.role !== USER_ROLE.PESERTA) {
        throw ApiError.badRequest(`User's role is not PESERTA`);
      }

      const result = await service.createData(req.body);
      // service.sendNotificationEmail(userExist.email, userExist.nama);
      return responseHandler.succes(res, `Success create ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async createJadwalBimbingan(req, res, next) {
    const service = new StudentService(req, JadwalBimbinganPeserta);
    try {
      await service.checkPesertaId(req);
      const result = await service.createJadwalBimbingan(req);
      return responseHandler.succes(res, `Success create Jadwal_Bimbingan_Peserta`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOneJadwal(req, res, next) {
    const service = new StudentService(req, JadwalBimbinganPeserta);
    try {
      const result = await service.getOneJadwalBimbingan(req);
      return responseHandler.succes(res, `Success get one ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    const service = new StudentService(req, Peserta);
    try {
      const result = await service.updateStudentByUserId(req);
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    const service = new StudentService(req, Peserta);
    try {
      await service.deleteStudentByUserId(req);
      return responseHandler.succes(res, `Success delete ${service.db.name}`);
    } catch (error) {
      next(error);
    }
  }

  static async getPesertaProfile(req, res, next) {
    const service = new StudentService(req, Peserta);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.getPesertaProfile(user.peserta.id);
      return responseHandler.succes(res, `Success get ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async updatePesertaProfile(req, res, next) {
    const service = new StudentService(req, Peserta);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.updatePesertaProfile(req, req.body, user.peserta.id);
      return responseHandler.succes(res, `Success update ${service.db.name}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentController;

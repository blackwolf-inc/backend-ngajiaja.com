const BimbinganService = require('../service/bimbingan.service');
const PengajarService = require('../../dashboard/pengajar/services/pengajar.service');
const UserService = require('../../registration/services/user.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const { Period, BimbinganReguler, User } = db;

class BimbinganPeserta {
  static async getDataBimbingan(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const [totalPending, totalOnGoing, totalAbsent] = await Promise.all([
        service.bimbinganPending(user.pengajar.id, null),
        service.getBimbinganActivated(user.pengajar.id),
        service.getAbsent(user.pengajar.id),
      ]);
      return responseHandler.succes(res, `Success get data bimbingan`, {
        total_pending: totalPending.length,
        total_on_going: totalOnGoing,
        total_absent: totalAbsent,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganPending(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.bimbinganPending(user.pengajar.id, req.query.name);
      return responseHandler.succes(res, `Success get bimbingan menunggu`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganOnGoing(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.bimbinganOnGoing(
        user.pengajar.id,
        req.query.name,
        req.query.level,
      );
      return responseHandler.succes(res, `Success get bimbingan akan datang`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganDone(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.bimbinganDone(
        user.pengajar.id,
        req.query.name,
        req.query.startDate,
        req.query.endDate,
      );
      return responseHandler.succes(res, `Success get bimbingan selesai`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOneBimbingan(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.detailBimbingan(req.params.id, user.pengajar.id);
      return responseHandler.succes(res, `Success get detail bimbingan`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getDataDetailBimbingan(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    try {
      const user = await userService.getOneUser(req.user.id);
      const result = await service.dataDetailBimbingan(req.params.id, user.pengajar.id);
      return responseHandler.succes(res, `Success get data detail bimbingan`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getProgressPeserta(req, res, next) {
    const service = new BimbinganService(req, Period);
    try {
      const result = await service.progressPeserta(
        req.params.id,
        req.query.name,
        req.query.startDate,
        req.query.endDate,
      );
      return responseHandler.succes(res, `Success get progress peserta`, result);
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

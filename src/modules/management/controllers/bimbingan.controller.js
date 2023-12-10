const BimbinganService = require('../service/bimbingan.service');
const PengajarService = require('../../dashboard/pengajar/services/pengajar.service');
const UserService = require('../../registration/services/user.service');
const responseHandler = require('../../../helpers/responseHandler');
const db = require('../../../models/index');
const moment = require('moment');
const ApiError = require('../../../helpers/errorHandler');
const { STATUS_BIMBINGAN_ACTIVE } = require('../../../helpers/constanta');
const { Period, BimbinganReguler, User, BimbinganTambahan } = db;

class BimbinganPeserta {
  static async getDataBimbingan(req, res, next) {
    const service = new PengajarService(req, Period);
    const userService = new UserService(req, User);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const userData = await userService.getOneUser(user.id);
      const [totalPending, totalOnGoing, totalAbsent] = await Promise.all([
        service.bimbinganPending(userData.pengajar.id, null),
        service.getBimbinganActivated(userData.pengajar.id),
        service.getAbsent(userData.pengajar.id),
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
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const userData = await userService.getOneUser(user.id);
      const result = await service.bimbinganPending(userData.pengajar.id, req.query.name);
      return responseHandler.succes(res, `Success get bimbingan menunggu`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganOnGoing(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const userData = await userService.getOneUser(user.id);
      const result = await service.bimbinganOnGoing(
        userData.pengajar.id,
        req.query.name,
        req.query.level
      );
      return responseHandler.succes(res, `Success get bimbingan akan datang`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getBimbinganDone(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const userData = await userService.getOneUser(user.id);
      const result = await service.bimbinganDone(
        userData.pengajar.id,
        req.query.name,
        req.query.startDate,
        req.query.endDate
      );
      return responseHandler.succes(res, `Success get bimbingan selesai`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOneBimbingan(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const userData = await userService.getOneUser(user.id);
      const result = await service.detailBimbingan(req.params.id, userData.pengajar.id);
      return responseHandler.succes(res, `Success get detail bimbingan`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getDataDetailBimbingan(req, res, next) {
    const service = new BimbinganService(req, Period);
    const userService = new UserService(req, User);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const dataUser = await userService.getOneUser(user.id);
      const result = await service.dataDetailBimbingan(req.params.id, dataUser.pengajar.id);
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
        req.query.endDate
      );
      return responseHandler.succes(res, `Success get progress peserta`, result);
    } catch (error) {
      next(error);
    }
  }

  static async updateReguler(req, res, next) {
    const service = new BimbinganService(req, BimbinganReguler);
    try {
      let result;
      if (req.body.persetujuan_peserta) {
        const bimbingan = await service.getOneById(req.params.id);
        if (req.body.persetujuan_peserta === 1) {
          result = await service.updateData(
            {
              persetujuan_peserta: req.body.persetujuan_peserta,
              tanggal: bimbingan.tanggal_baru,
              jam_bimbingan: bimbingan.jam_baru,
              status: STATUS_BIMBINGAN_ACTIVE.WAITING,
              hari_bimbingan: moment(bimbingan.tanggal_baru)
                .locale('id')
                .format('dddd')
                .toUpperCase(),
            },
            { id: req.params.id }
          );
        } else {
          result = await service.updateData(
            { persetujuan_peserta: req.body.persetujuan_peserta },
            { id: req.params.id }
          );
        }
      } else if (req.body.keterangan_izin_peserta) {
        result = await service.updateData(
          {
            absensi_pengajar: 0,
            status: STATUS_BIMBINGAN_ACTIVE.CANCELED,
            keterangan_izin_peserta: req.body.keterangan_izin_peserta,
          },
          { id: req.params.id }
        );
      } else {
        result = await service.updateData(req.body, { id: req.params.id });
      }
      return responseHandler.succes(res, `Success update data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async updateTambahan(req, res, next) {
    const service = new BimbinganService(req, BimbinganTambahan);
    try {
      let result;
      if (req.body.persetujuan_peserta) {
        const bimbingan = await service.getOneById(req.params.id);
        if (req.body.persetujuan_peserta === 1) {
          result = await service.updateData(
            {
              persetujuan_peserta: req.body.persetujuan_peserta,
              tanggal: bimbingan.tanggal_baru,
              jam_bimbingan: bimbingan.jam_baru,
              status: STATUS_BIMBINGAN_ACTIVE.WAITING,
              hari_bimbingan: moment(bimbingan.tanggal_baru)
                .locale('id')
                .format('dddd')
                .toUpperCase(),
            },
            { id: req.params.id }
          );
        } else {
          result = await service.updateData(
            { persetujuan_peserta: req.body.persetujuan_peserta },
            { id: req.params.id }
          );
        }
      } else {
        result = await service.updateData(req.body, { id: req.params.id });
      }
      return responseHandler.succes(res, `Success update data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllPeriodByPesertaId(req, res, next) {
    const service = new BimbinganService(req, Period);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }
      const result = await service.getAllPeriod(user.id, req.query);
      return responseHandler.succes(res, `Success get all ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getOnePeriodByPesertaId(req, res, next) {
    const service = new BimbinganService(req, Period);
    const user = req.user;
    try {
      if (!user) {
        throw ApiError.unauthorized('Not Authorized');
      }

      const result = await service.getOnePeriod(user.id, req.params.id);
      return responseHandler.succes(res, `Success get data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getCatatanReguler(req, res, next) {
    const service = new BimbinganService(req, BimbinganReguler);
    try {
      const result = await service.getCatatanBimbinganReguler(req.params.id);
      return responseHandler.succes(res, `Success get data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }

  static async getCatatanTambahan(req, res, next) {
    const service = new BimbinganService(req, BimbinganTambahan);
    try {
      const result = await service.getCatatanBimbinganTambahan(req.params.id);
      return responseHandler.succes(res, `Success get data ${service.db.name}s`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BimbinganPeserta;

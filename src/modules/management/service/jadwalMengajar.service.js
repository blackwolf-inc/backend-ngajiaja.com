const BaseService = require('../../../base/base.service');
const { JadwalMengajarPengajar, Pengajar } = require('../../../models');
const ApiError = require('../../../helpers/errorHandler');
const { Op } = require('sequelize');
const { STATUS_JADWAL_PENGAJAR } = require('../../../helpers/constanta');
const moment = require('moment');

class PengajarService extends BaseService {
  async checkJadwalId(id) {
    const result = await JadwalMengajarPengajar.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Jadwal with id ${id} not found`);
  }

  async checkTeacherId(user_id) {
    const result = await Pengajar.findOne({ where: { user_id } });
    if (!result) throw ApiError.notFound(`Teacher with id ${result.id} not found`);
    return result;
  }

  async checkTeacherExist(pengajar_id) {
    // console.log(pengajar_id);
    const result = await Pengajar.findOne({ where: { id: pengajar_id } });
    if (!result) throw ApiError.notFound(`Teacher with id ${result.id} not found`);
    return result;
  }

  async getAllByPengajarId(id) {
    const query = {
      pengajar_id: id,
    };
    const result = await this.getAll(query);
    return result;
  }

  async createJadwalMengajar(payload) {
    payload.status = STATUS_JADWAL_PENGAJAR.ACTIVE;

    const createdJadwalMengajar = await JadwalMengajarPengajar.create(payload);
    return createdJadwalMengajar;
  }

  async checkJadwalDuplicate(payload) {
    const result = await JadwalMengajarPengajar.findOne({
      where: {
        pengajar_id: payload.pengajar_id,
        hari_mengajar: payload.hari_mengajar,
        mulai_mengajar: payload.mulai_mengajar,
        selesai_mengajar: payload.selesai_mengajar,
      },
    });
    if (
      result &&
      payload.mulai_mengajar < result.selesai_mengajar &&
      payload.selesai_mengajar > result.mulai_mengajar
    ) {
      throw ApiError.badRequest(
        `Jadwal with hari ${result.hari_mengajar} and mulai_mengajar ${result.mulai_mengajar} - selesai_mengajar ${result.selesai_mengajar} already exist`
      );
    }
  }

  // async checkJadwalOverlap(payload) {
  //   const existingJadwal = await JadwalMengajarPengajar.findAll({
  //     where: {
  //       pengajar_id: payload.pengajar_id,
  //       hari_mengajar: payload.hari_mengajar,
  //       [Op.or]: [
  //         {
  //           mulai_mengajar: {
  //             [Op.between]: [payload.mulai_mengajar, payload.selesai_mengajar],
  //           },
  //         },
  //         {
  //           selesai_mengajar: {
  //             [Op.between]: [payload.mulai_mengajar, payload.selesai_mengajar],
  //           },
  //         },
  //       ],
  //     },
  //   });

  //     if (existingJadwal.length > 0) {
  //       throw ApiError.badRequest('Jadwal Overlap');
  //     }
  //   }
}

module.exports = PengajarService;

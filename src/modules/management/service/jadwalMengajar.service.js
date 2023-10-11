const BaseService = require('../../../base/base.service');
const { JadwalMengajarPengajar, Pengajar } = require('../../../models');
const ApiError = require('../../../helpers/errorHandler');
const { Op } = require('sequelize');
const moment = require('moment');

class PengajarService extends BaseService {
  async checkJadwalId(id) {
    const result = await JadwalMengajarPengajar.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Jadwal with id ${id} not found`);
  }

  async checkTeacherId(user_id) {
    const result = await Pengajar.findOne({ where: { user_id } });
    if (!result) throw ApiError.notFound(`Teacher with id ${result.id}`);
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
    const timeString = payload.jam_mengajar;
    const timeObject = moment(timeString, 'HH:mm').format('HH:mm:ss');

    payload.jam_wawancara = timeObject;

    const createdJadwalMengajar = await this.createData(payload);
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

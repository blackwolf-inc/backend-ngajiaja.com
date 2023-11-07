const BaseService = require('../../../base/base.service');
const {
  JadwalMengajarPengajar,
  Pengajar,
  User,
  Period,
  JadwalBimbinganPeserta,
  Peserta,
} = require('../../../models');
const ApiError = require('../../../helpers/errorHandler');
const { STATUS_BIMBINGAN, STATUS_JADWAL } = require('../../../helpers/constanta');
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

  async getAllByPengajarId(id, status, day, time) {
    const result = await this.__findAll({ where: { pengajar_id: id } }, this.#includeQuery);
    if (!result) throw ApiError.notFound(`Jadwal with pengajar id ${id} not found`);

    const data = [];
    for (const jadwal of result.datas) {
      for (const period of jadwal.pengajar.period) {
        if (period.status !== STATUS_BIMBINGAN.ACTIVATED) continue;

        // check if jadwal pengajar is same with jadwal bimbingan
        const fieldDaysToCompare = ['hari_bimbingan_1', 'hari_bimbingan_2'];
        const fieldHoursToCompare = ['jam_bimbingan_1', 'jam_bimbingan_2'];
        const timeMengajar = `${jadwal.mulai_mengajar} - ${jadwal.selesai_mengajar}`;

        for (const fieldDay of fieldDaysToCompare) {
          if (
            period.peserta.jadwal_bimbingan_peserta[fieldDay] === jadwal.hari_mengajar &&
            period.peserta.jadwal_bimbingan_peserta[fieldDay] !== null
          ) {
            for (const fieldHour of fieldHoursToCompare) {
              if (
                period.peserta.jadwal_bimbingan_peserta[fieldHour] === timeMengajar &&
                period.peserta.jadwal_bimbingan_peserta[fieldHour] !== null
              ) {
                const dataJadwalBimbingan = {
                  jadwal_id: jadwal.id,
                  peserta_id: period.peserta.id,
                  user_id: period.peserta.User.id,
                  name: period.peserta.User.nama,
                  status: STATUS_JADWAL.BIMBINGAN,
                  day: jadwal.hari_mengajar,
                  time: timeMengajar,
                };

                data.push(dataJadwalBimbingan);
              }
            }
          }
        }

        const dataJadwalTersedia = {
          jadwal_id: jadwal.id,
          peserta_id: null,
          user_id: null,
          name: null,
          status: STATUS_JADWAL.AVAILABLE,
          day: jadwal.hari_mengajar,
          time: timeMengajar,
        };

        data.push(dataJadwalTersedia);
      }
    }

    let filteredData;
    if (status && day && time) {
      filteredData = data.filter(
        (item) => item.status === status && item.day === day && item.time === time,
      );
    } else if (status && day) {
      filteredData = data.filter((item) => item.status === status && item.day === day);
    } else if (status && time) {
      filteredData = data.filter((item) => item.status === status && item.time === time);
    } else if (day && time) {
      filteredData = data.filter((item) => item.day === day && item.time === time);
    } else if (status) {
      filteredData = data.filter((item) => item.status === status);
    } else if (day) {
      filteredData = data.filter((item) => item.day === day);
    } else if (time) {
      filteredData = data.filter((item) => item.time === time);
    } else {
      filteredData = data;
    }

    if (filteredData.length === 0) throw ApiError.notFound(`Jadwal not found`);
    return filteredData;
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
        `Jadwal with hari ${result.hari_mengajar} and mulai_mengajar ${result.mulai_mengajar} - selesai_mengajar ${result.selesai_mengajar} already exist`,
      );
    }
  }

  async dataJadwalMengajar(id) {
    const result = await this.getAllByPengajarId(id);
    if (!result) throw ApiError.notFound(`Jadwal with pengajar id ${id} not found`);

    let jadwalAvailable = 0;
    let jadwalBimbingan = 0;
    for (const jadwal of result) {
      if (jadwal.status === STATUS_JADWAL.AVAILABLE) {
        jadwalAvailable++;
      }

      if (jadwal.status === STATUS_JADWAL.BIMBINGAN) {
        jadwalBimbingan++;
      }
    }

    return {
      total_available: jadwalAvailable,
      total_bimbingan: jadwalBimbingan,
      total_jadwal: result.length,
    };
  }

  #includeQuery = [
    {
      model: Pengajar,
      as: 'pengajar',
      include: [
        {
          model: Period,
          as: 'period',
          include: [
            {
              model: Peserta,
              as: 'peserta',
              include: [
                {
                  model: JadwalBimbinganPeserta,
                  as: 'jadwal_bimbingan_peserta',
                },
                {
                  model: User,
                  attributes: {
                    exclude: ['password', 'token'],
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ];

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

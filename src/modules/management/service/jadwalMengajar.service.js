const BaseService = require('../../../base/base.service');
const {
  JadwalMengajarPengajar,
  Pengajar,
  User,
  Period,
  Peserta,
  BimbinganReguler,
  BimbinganTambahan,
} = require('../../../models');
const ApiError = require('../../../helpers/errorHandler');
const { STATUS_BIMBINGAN, STATUS_JADWAL, TYPE_BIMBINGAN } = require('../../../helpers/constanta');
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

  async getAllByPengajarId(id, status, day, time) {
    const result = await this.__findAll({ where: { pengajar_id: id } }, this.#includeQuery);
    if (!result) throw ApiError.notFound(`Jadwal with pengajar id ${id} not found`);

    const data = [];
    for (const jadwal of result.datas) {
      const startTime = jadwal.mulai_mengajar.toString().slice(0, -3);
      const endTime = jadwal.selesai_mengajar.toString().slice(0, -3);
      const timeMengajar = `${startTime}-${endTime}`;
      let dataJadwalBimbingan;

      if (jadwal.pengajar.period.length === 0) {
        dataJadwalBimbingan = this.#dataJadwalBimbinganAvailable(jadwal, timeMengajar);
        data.push(dataJadwalBimbingan);
      } else {
        for (const period of jadwal.pengajar.period) {
          let isSameJadwal = false;

          if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
            if (period.bimbingan_reguler.length === 0) {
              dataJadwalBimbingan = this.#dataJadwalBimbinganAvailable(jadwal, timeMengajar);
              data.push(dataJadwalBimbingan);
              continue;
            }

            for (let i = 0; i < 2; i++) {
              if (period.bimbingan_reguler[i].hari_bimbingan === jadwal.hari_mengajar) {
                if (period.bimbingan_reguler[i].jam_bimbingan === timeMengajar) {
                  isSameJadwal = true;
                }
              }
            }
          }

          if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
            if (period.bimbingan_tambahan.length === 0) {
              dataJadwalBimbingan = this.#dataJadwalBimbinganAvailable(jadwal, timeMengajar);
              data.push(dataJadwalBimbingan);
              continue;
            }

            for (let i = 0; i < 2; i++) {
              if (period.bimbingan_tambahan[i].hari_bimbingan === jadwal.hari_mengajar) {
                if (period.bimbingan_tambahan[i].jam_bimbingan === timeMengajar) {
                  isSameJadwal = true;
                }
              }
            }
          }

          if (isSameJadwal && period.status === STATUS_BIMBINGAN.ACTIVATED) {
            dataJadwalBimbingan = this.#dataJadwalBimbingan(jadwal, period, timeMengajar);
          } else {
            dataJadwalBimbingan = this.#dataJadwalBimbinganAvailable(jadwal, timeMengajar);
          }

          data.push(dataJadwalBimbingan);
        }
      }
    }

    // remove duplicate data from array
    const uniqueData = data.filter(
      (thing, index, self) =>
        index ===
        self.findIndex((t) => t.jadwal_id === thing.jadwal_id && t.status === thing.status),
    );

    for (let i = 0; i < uniqueData.length; i++) {
      for (let j = i + 1; j < uniqueData.length; j++) {
        if (uniqueData[i].jadwal_id === uniqueData[j].jadwal_id) {
          if (uniqueData[i].status === STATUS_JADWAL.BIMBINGAN) {
            uniqueData.splice(j, 1);
          }

          if (uniqueData[j].status === STATUS_JADWAL.BIMBINGAN) {
            uniqueData.splice(i, 1);
          }
        }
      }
    }

    let filteredData;
    if (status && day && time) {
      filteredData = uniqueData.filter(
        (item) => item.status === status && item.day === day && item.time === time,
      );
    } else if (status && day) {
      filteredData = uniqueData.filter((item) => item.status === status && item.day === day);
    } else if (status && time) {
      filteredData = uniqueData.filter((item) => item.status === status && item.time === time);
    } else if (day && time) {
      filteredData = uniqueData.filter((item) => item.day === day && item.time === time);
    } else if (status) {
      filteredData = uniqueData.filter((item) => item.status === status);
    } else if (day) {
      filteredData = uniqueData.filter((item) => item.day === day);
    } else if (time) {
      filteredData = uniqueData.filter((item) => item.time === time);
    } else {
      filteredData = uniqueData;
    }

    return filteredData;
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

  #dataJadwalBimbingan(jadwal, period, timeMengajar) {
    return {
      jadwal_id: jadwal.id,
      peserta_id: period.peserta.id,
      user_id: period.peserta.user.id,
      name: period.peserta.user.nama,
      profile_picture: period.peserta.user.profile_picture,
      no_wa: period.peserta.user.telp_wa,
      status: STATUS_JADWAL.BIMBINGAN,
      day: jadwal.hari_mengajar,
      time: timeMengajar,
    };
  }

  #dataJadwalBimbinganAvailable(jadwal, timeMengajar) {
    return {
      jadwal_id: jadwal.id,
      peserta_id: null,
      user_id: null,
      name: null,
      profile_picture: null,
      no_wa: null,
      status: STATUS_JADWAL.AVAILABLE,
      day: jadwal.hari_mengajar,
      time: timeMengajar,
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
                  model: User,
                  as: 'user',
                  attributes: {
                    exclude: ['password', 'token'],
                  },
                },
              ],
            },
            {
              model: BimbinganReguler,
              as: 'bimbingan_reguler',
            },
            {
              model: BimbinganTambahan,
              as: 'bimbingan_tambahan',
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

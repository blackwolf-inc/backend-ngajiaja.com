const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { TYPE_BIMBINGAN, STATUS_BIMBINGAN } = require('../../../helpers/constanta');
const {
  JadwalBimbinganPeserta,
  User,
  Peserta,
  Pengajar,
  BimbinganReguler,
  BimbinganTambahan,
} = require('../../../models');
const moment = require('moment');

class BimbinganService extends BaseService {
  async bimbinganOnGoing(id, pesertaName, level) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.ACTIVATED } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        let attendance = 0;
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_peserta === 1) attendance += 1;
        }

        const bimbinganOnGoing = {
          period_id: period.id,
          peserta_id: period.peserta.id,
          user_id: period.peserta.User.id,
          name: period.peserta.User.nama,
          schedule: {
            day1: period.peserta.jadwal_bimbingan_peserta.hari_bimbingan_1,
            hour1: period.peserta.jadwal_bimbingan_peserta.jam_bimbingan_1,
            day2: period.peserta.jadwal_bimbingan_peserta.hari_bimbingan_2,
            hour2: period.peserta.jadwal_bimbingan_peserta.jam_bimbingan_2,
          },
          attendance,
          meet: `${attendance}/8`,
          level: period.peserta.level,
        };

        data.push(bimbinganOnGoing);
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        let attendance = 0;
        for (const bimbinganTambahan of period.bimbingan_tambahan) {
          if (bimbinganTambahan.absensi_peserta === 1) attendance += 1;
        }

        const bimbinganOnGoing = {
          period_id: period.id,
          peserta_id: period.peserta.id,
          user_id: period.peserta.User.id,
          name: period.peserta.User.nama,
          schedule: {
            day1: period.peserta.jadwal_bimbingan_peserta.hari_bimbingan_1,
            hour1: period.peserta.jadwal_bimbingan_peserta.jam_bimbingan_1,
            day2: period.peserta.jadwal_bimbingan_peserta.hari_bimbingan_2,
            hour2: period.peserta.jadwal_bimbingan_peserta.jam_bimbingan_2,
          },
          attendance,
          meet: `${attendance}/2`,
          level: period.peserta.level,
        };

        data.push(bimbinganOnGoing);
      }
    }

    // check if peserta name or level is provided for filtering
    let filteredPeserta;
    if (pesertaName) {
      if (pesertaName.length < 3)
        throw ApiError.badRequest('Peserta name must be at least 3 characters');

      if (level) {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.includes(pesertaName) && peserta.level === level;
        });
      } else {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.includes(pesertaName);
        });
      }
    }

    if (level) {
      filteredPeserta = data.filter((peserta) => {
        return peserta.level === level;
      });
    }

    if (filteredPeserta) {
      if (filteredPeserta.length === 0) throw ApiError.notFound(`Peserta not found`);

      return filteredPeserta;
    }

    return data;
  }

  async bimbinganDone(id, pesertaName, periodDate) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.FINISHED } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        let absent = 0;
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_peserta === 0) absent += 1;
        }

        const bimbinganDone = {
          period_id: period.id,
          peserta_id: period.peserta.id,
          user_id: period.peserta.User.id,
          name: period.peserta.User.nama,
          period: `${period.bimbingan_reguler[0].tanggal} - ${
            period.bimbingan_reguler[period.bimbingan_reguler.length - 1].tanggal
          }`,
          absent,
          peserta_review: period.catatan_peserta,
        };

        data.push(bimbinganDone);
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        let absent = 0;
        for (const bimbinganTambahan of period.bimbingan_tambahan) {
          if (bimbinganTambahan.absensi_peserta === 0) absent += 1;
        }

        const bimbinganDone = {
          period_id: period.id,
          peserta_id: period.peserta.id,
          user_id: period.peserta.User.id,
          name: period.peserta.User.nama,
          period: `${period.bimbingan_tambahan[0].tanggal} - ${
            period.bimbingan_tambahan[period.bimbingan_tambahan.length - 1].tanggal
          }`,
          absent,
          peserta_review: period.catatan_peserta,
        };

        data.push(bimbinganDone);
      }
    }

    // check if peserta name or period date is provided for filtering
    let filteredPeserta;
    if (pesertaName) {
      if (pesertaName.length < 3)
        throw ApiError.badRequest('Peserta name must be at least 3 characters');

      if (periodDate) {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.includes(pesertaName) && peserta.period === periodDate;
        });
      } else {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.includes(pesertaName);
        });
      }
    }

    if (periodDate) {
      filteredPeserta = data.filter((peserta) => {
        return peserta.period === periodDate;
      });
    }

    if (filteredPeserta) {
      if (filteredPeserta.length === 0) throw ApiError.notFound(`Peserta not found`);

      return filteredPeserta;
    }

    return data;
  }

  async dataDetailBimbingan(id, pengajarId) {
    const result = await this.__findOne(
      { where: { id, pengajar_id: pengajarId } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);

    let age = 0;
    if (result.peserta.User.tgl_lahir) {
      const birthdate = moment(result.peserta.User.tgl_lahir, 'YYYY-MM-DD').toDate();
      const birthYear = birthdate.getFullYear();
      const birthMonth = birthdate.getMonth();
      const birthDay = birthdate.getDate();

      const today = moment().toDate();
      const todayYear = today.getFullYear();
      const todayMonth = today.getMonth();
      const todayDay = today.getDate();

      age = todayYear - birthYear;
      if (todayMonth < birthMonth || (todayMonth === birthMonth && todayDay < birthDay)) age--;
    }

    return {
      name: result.peserta.User.nama,
      gender: result.peserta.User.jenis_kelamin,
      age,
      level: result.peserta.level,
    };
  }

  async detailBimbingan(id, pengajarId) {
    const result = await this.__findOne(
      { where: { id, pengajar_id: pengajarId } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);

    const data = [];
    if (result.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
      for (const bimbinganReguler of result.bimbingan_reguler) {
        const dataBimbinganReguler = {
          period_id: result.id,
          peserta_id: result.peserta.id,
          user_id: result.peserta.User.id,
          status: null,
          date: bimbinganReguler.tanggal,
          time: bimbinganReguler.jam_bimbingan,
          attendance: bimbinganReguler.absensi_peserta,
          pengajar_review: bimbinganReguler.catatan_pengajar,
        };

        data.push(dataBimbinganReguler);
      }
    }

    if (result.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
      for (const bimbinganTambahan of result.bimbingan_tambahan) {
        const dataBimbinganTambahan = {
          period_id: result.id,
          peserta_id: result.peserta.id,
          user_id: result.peserta.User.id,
          status: null,
          date: bimbinganTambahan.tanggal,
          time: bimbinganTambahan.jam_bimbingan,
          attendance: bimbinganTambahan.absensi_peserta,
          pengajar_review: bimbinganTambahan.catatan_pengajar,
        };

        data.push(dataBimbinganTambahan);
      }
    }

    return data;
  }

  async progressPeserta(id, pengajarName, periodDate) {
    const result = await this.__findAll(
      { where: { peserta_id: id } },
      this.#includeQueryProgressPeserta,
    );
    if (!result) throw ApiError.notFound(`Peserta with id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_peserta === 0 || bimbinganReguler.absensi_pengajar === 0)
            continue;
          const dataBimbinganReguler = {
            pengajar: period.pengajar.user.nama,
            date: bimbinganReguler.tanggal,
            time: bimbinganReguler.jam_bimbingan,
            pengajar_review: bimbinganReguler.catatan_pengajar,
          };

          data.push(dataBimbinganReguler);
        }
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        for (const bimbinganTambahan of period.bimbingan_tambahan) {
          if (bimbinganTambahan.absensi_peserta === 0 || bimbinganTambahan.absensi_pengajar === 0)
            continue;
          const dataBimbinganTambahan = {
            pengajar: period.pengajar.user.nama,
            date: bimbinganTambahan.tanggal,
            time: bimbinganTambahan.jam_bimbingan,
            pengajar_review: bimbinganTambahan.catatan_pengajar,
          };

          data.push(dataBimbinganTambahan);
        }
      }
    }

    let filteredData;
    if (pengajarName) {
      if (pengajarName.length < 3)
        throw ApiError.badRequest('Pengajar name must be at least 3 characters');

      if (periodDate) {
        filteredData = data.filter((pengajar) => {
          return (
            pengajar.pengajar.includes(pengajarName) &&
            moment(pengajar.date) >= moment(periodDate.split(' - ')[0]) &&
            moment(pengajar.date) <= moment(periodDate.split(' - ')[1])
          );
        });
      } else {
        filteredData = data.filter((pengajar) => {
          return pengajar.pengajar.includes(pengajarName);
        });
      }
    }

    if (periodDate) {
      filteredData = data.filter((pengajar) => {
        return (
          moment(pengajar.date) >= moment(periodDate.split(' - ')[0]) &&
          moment(pengajar.date) <= moment(periodDate.split(' - ')[1])
        );
      });
    }

    if (filteredData) {
      if (filteredData.length === 0) throw ApiError.notFound(`Pengajar not found`);

      return filteredData;
    }

    return data;
  }

  #includeQuery = [
    {
      model: Peserta,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'peserta',
      include: [
        {
          model: JadwalBimbinganPeserta,
          attributes: {
            exclude: ['peserta_id'],
          },
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
    {
      model: BimbinganReguler,
      attributes: {
        exclude: ['period_id'],
      },
      as: 'bimbingan_reguler',
    },
    {
      model: BimbinganTambahan,
      attributes: {
        exclude: ['period_id'],
      },
      as: 'bimbingan_tambahan',
    },
  ];

  #includeQueryProgressPeserta = [
    {
      model: Pengajar,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'pengajar',
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password', 'token'],
          },
          as: 'user',
        },
      ],
    },
    {
      model: BimbinganReguler,
      attributes: {
        exclude: ['period_id'],
      },
      as: 'bimbingan_reguler',
    },
    {
      model: BimbinganTambahan,
      attributes: {
        exclude: ['period_id'],
      },
      as: 'bimbingan_tambahan',
    },
  ];
}

module.exports = BimbinganService;

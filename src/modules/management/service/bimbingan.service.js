const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const {
  TYPE_BIMBINGAN,
  STATUS_BIMBINGAN,
  STATUS_BIMBINGAN_ACTIVE,
} = require('../../../helpers/constanta');
const {
  User,
  Peserta,
  Pengajar,
  BimbinganReguler,
  BimbinganTambahan,
  Period,
  sequelize,
} = require('../../../models');
const { QueryTypes } = require('sequelize');
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
            day1: period.bimbingan_reguler[0].hari_bimbingan,
            hour1: period.bimbingan_reguler[0].jam_bimbingan,
            day2: period.bimbingan_reguler[1].hari_bimbingan,
            hour2: period.bimbingan_reguler[1].jam_bimbingan,
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
            day1: period.bimbingan_tambahan[0].hari_bimbingan,
            hour1: period.bimbingan_tambahan[0].jam_bimbingan,
            day2: period.bimbingan_tambahan[1].hari_bimbingan,
            hour2: period.bimbingan_tambahan[1].jam_bimbingan,
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
          return (
            peserta.toLowerCase().name.includes(pesertaName.toLowerCase()) &&
            peserta.level === level
          );
        });
      } else {
        filteredPeserta = data.filter((peserta) => {
          return peserta.toLowerCase().name.includes(pesertaName.toLowerCase());
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

  async bimbinganDone(id, pesertaName, startDate, endDate) {
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

      if (startDate && endDate) {
        filteredPeserta = data.filter((peserta) => {
          return (
            peserta.name.toLowerCase().includes(pesertaName.toLowerCase()) &&
            moment(peserta.period.split(' - ')[0]) >= moment(startDate) &&
            moment(peserta.period.split(' - ')[1]) <= moment(endDate)
          );
        });
      } else {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.toLowerCase().includes(pesertaName.toLowerCase());
        });
      }
    }

    if (startDate && endDate) {
      filteredPeserta = data.filter((peserta) => {
        return (
          peserta.name.includes(pesertaName) &&
          moment(peserta.period.split(' - ')[0]) >= moment(startDate) &&
          moment(peserta.period.split(' - ')[1]) <= moment(endDate)
        );
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
          bimbingan_reguler_id: bimbinganReguler.id,
          status: null,
          date: bimbinganReguler.tanggal,
          time: bimbinganReguler.jam_bimbingan,
          attendance: bimbinganReguler.absensi_peserta,
          pengajar_review: bimbinganReguler.catatan_pengajar,
        };

        if (!bimbinganReguler.link_meet) {
          dataBimbinganReguler.status = STATUS_BIMBINGAN_ACTIVE.NOT_SET;
        }

        if (bimbinganReguler.link_meet && moment().isBefore(dataBimbinganReguler.date)) {
          dataBimbinganReguler.status = STATUS_BIMBINGAN_ACTIVE.WAITING;
        }

        if (
          bimbinganReguler.link_meet &&
          !bimbinganReguler.catatan_pengajar &&
          moment().isAfter(moment(dataBimbinganReguler.date))
        ) {
          dataBimbinganReguler.status = `${STATUS_BIMBINGAN_ACTIVE.WAITING} (LATE)`;
        }

        if (bimbinganReguler.absensi_peserta === 1 || bimbinganReguler.absensi_pengajar === 1) {
          dataBimbinganReguler.status = STATUS_BIMBINGAN_ACTIVE.FINISHED;
        }

        data.push(dataBimbinganReguler);
      }
    }

    if (result.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
      for (const bimbinganTambahan of result.bimbingan_tambahan) {
        const dataBimbinganTambahan = {
          period_id: result.id,
          peserta_id: result.peserta.id,
          user_id: result.peserta.User.id,
          bimbingan_tambahan_id: bimbinganTambahan.id,
          status: null,
          date: bimbinganTambahan.tanggal,
          time: bimbinganTambahan.jam_bimbingan,
          attendance: bimbinganTambahan.absensi_peserta,
          pengajar_review: bimbinganTambahan.catatan_pengajar,
        };

        if (!bimbinganTambahan.link_meet) {
          dataBimbinganTambahan.status = STATUS_BIMBINGAN_ACTIVE.NOT_SET;
        }

        if (bimbinganTambahan.link_meet && moment().isBefore(dataBimbinganTambahan.date)) {
          dataBimbinganTambahan.status = STATUS_BIMBINGAN_ACTIVE.WAITING;
        }

        if (
          bimbinganTambahan.link_meet &&
          !bimbinganTambahan.catatan_pengajar &&
          moment().isAfter(moment(dataBimbinganTambahan.date))
        ) {
          dataBimbinganTambahan.status = `${STATUS_BIMBINGAN_ACTIVE.WAITING} (LATE)`;
        }

        if (bimbinganTambahan.absensi_peserta === 1 || bimbinganTambahan.absensi_pengajar === 1) {
          dataBimbinganTambahan.status = STATUS_BIMBINGAN_ACTIVE.FINISHED;
        }

        data.push(dataBimbinganTambahan);
      }
    }

    return data;
  }

  async progressPeserta(id, pengajarName, startDate, endDate) {
    const result = await this.__findAll(
      { where: { peserta_id: id } },
      this.#includeQueryProgressPeserta,
    );
    if (!result) throw ApiError.notFound(`Peserta with id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_peserta === 1 || bimbinganReguler.absensi_pengajar === 1) {
            const dataBimbinganReguler = {
              pengajar: period.pengajar.user.nama,
              date: bimbinganReguler.tanggal,
              time: bimbinganReguler.jam_bimbingan,
              pengajar_review: bimbinganReguler.catatan_pengajar,
            };

            data.push(dataBimbinganReguler);
          }
        }
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        for (const bimbinganTambahan of period.bimbingan_tambahan) {
          if (bimbinganTambahan.absensi_peserta === 1 || bimbinganTambahan.absensi_pengajar === 1) {
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
    }

    let filteredData;
    if (pengajarName) {
      if (pengajarName.length < 3)
        throw ApiError.badRequest('Pengajar name must be at least 3 characters');

      if (startDate && endDate) {
        filteredData = data.filter((pengajar) => {
          return (
            pengajar.pengajar.toLowerCase().includes(pengajarName.toLowerCase()) &&
            moment(pengajar.date) >= moment(startDate) &&
            moment(pengajar.date) <= moment(endDate)
          );
        });
      } else {
        filteredData = data.filter((pengajar) => {
          return pengajar.pengajar.toLowerCase().includes(pengajarName.toLowerCase());
        });
      }
    }

    if (startDate && endDate) {
      filteredData = data.filter((pengajar) => {
        return (
          pengajar.pengajar.includes(pengajarName) &&
          moment(pengajar.date) >= moment(startDate) &&
          moment(pengajar.date) <= moment(endDate)
        );
      });
    }

    if (filteredData) {
      if (filteredData.length === 0) throw ApiError.notFound(`Pengajar not found`);

      return filteredData;
    }

    return data;
  }

  async getAllPeriod(user_id, req) {
    const pesertaId = await sequelize.query(
      `
      SELECT *
      FROM Pesertas
      WHERE user_id = :userId
      `,
      {
        replacements: { userId: user_id },
        type: QueryTypes.SELECT,
      },
    );

    const period = await Period.findAll({
      where: { peserta_id: pesertaId[0].id, status: req.status },
      include: [
        {
          model: Pengajar,
          as: 'pengajar',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
        {
          model: BimbinganReguler,
          as: 'bimbingan_reguler',
          where: {
            absensi_peserta: 1,
            absensi_pengajar: 1,
          },
          required: false,
        },
        {
          model: BimbinganTambahan,
          as: 'bimbingan_tambahan',
          required: false,
        },
      ],
    });

    const result = period.map((data) => {
      const totalBimbinganReguler = data.bimbingan_reguler.length;
      return {
        id: data.id,
        nama: data.pengajar.user.nama,
        jenis_kelamin: data.pengajar.user.jenis_kelamin,
        hari_1: data.hari_1,
        jam_1: data.jam_1,
        hari_2: data.hari_2,
        jam_2: data.jam_2,
        jumlah_attedance_bimbingan_regular: totalBimbinganReguler ? totalBimbinganReguler : 0,
        tipe_bimbingan: data.tipe_bimbingan,
        status: data.status,
        infaq_bimbingan_tambahan_sebelum:
          data.bimbingan_tambahan.length > 0 ? data.bimbingan_tambahan[0].tanggal : null,
      };
    });

    return result;
  }

  async getOnePeriod(user_id, period_id) {
    const pesertaId = await sequelize.query(
      `
      SELECT *
      FROM Pesertas
      WHERE user_id = :userId
      `,
      {
        replacements: { userId: user_id },
        type: QueryTypes.SELECT,
      },
    );

    const bimbingan = await Period.findOne({
      where: { peserta_id: pesertaId[0].id, id: period_id },
      include: [
        {
          model: BimbinganReguler,
          as: 'bimbingan_reguler',
        },
        {
          model: BimbinganTambahan,
          as: 'bimbingan_tambahan',
        },
      ],
    });

    return bimbingan;
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

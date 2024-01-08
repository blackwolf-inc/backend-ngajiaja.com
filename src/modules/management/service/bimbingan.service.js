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

const base_url = process.env.BASE_URL;

class BimbinganService extends BaseService {
  async bimbinganOnGoing(id, pesertaName, level) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.ACTIVATED } },
      this.#includeQuery
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
          user_id: period.peserta.user.id,
          name: period.peserta.user.nama,
          no_telp: period.peserta.user.telp_wa,
          profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
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
          user_id: period.peserta.user.id,
          name: period.peserta.user.nama,
          no_telp: period.peserta.user.telp_wa,
          profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
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
      this.#includeQuery
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const base_url = process.env.BASE_URL;

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
          user_id: period.peserta.user.id,
          name: period.peserta.user.nama,
          profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
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
          user_id: period.peserta.user.id,
          name: period.peserta.user.nama,
          profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
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
      this.#includeQuery
    );
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);

    const base_url = process.env.BASE_URL;

    let age = 0;
    if (result.peserta.user.tgl_lahir) {
      const birthdate = moment(result.peserta.user.tgl_lahir, 'YYYY-MM-DD').toDate();
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
      user_id: result.peserta.user.id,
      peserta_id: result.peserta.id,
      name: result.peserta.user.nama,
      gender: result.peserta.user.jenis_kelamin,
      profile_picture: `${base_url}/images/${result.peserta.user.profile_picture}`,
      age,
      level: result.peserta.level,
    };
  }

  async detailBimbingan(id, pengajarId) {
    const result = await this.__findOne(
      { where: { id, pengajar_id: pengajarId } },
      this.#includeQuery
    );
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);

    const base_url = process.env.BASE_URL;

    const data = [];
    if (result.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
      for (const bimbinganReguler of result.bimbingan_reguler) {
        const dataBimbinganReguler = {
          period_id: result.id,
          peserta_id: result.peserta.id,
          user_id: result.peserta.user.id,
          profile_picture: `${base_url}/images/${result.peserta.user.profile_picture}`,
          bimbingan_reguler_id: bimbinganReguler.id,
          status: bimbinganReguler.status,
          date: bimbinganReguler.tanggal,
          time: bimbinganReguler.jam_bimbingan,
          attendance: bimbinganReguler.absensi_peserta,
          pengajar_review: bimbinganReguler.catatan_pengajar,
          link_meet: bimbinganReguler.link_meet,
        };

        data.push(dataBimbinganReguler);
      }
    }

    if (result.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
      for (const bimbinganTambahan of result.bimbingan_tambahan) {
        const dataBimbinganTambahan = {
          period_id: result.id,
          peserta_id: result.peserta.id,
          user_id: result.peserta.user.id,
          profile_picture: `${base_url}/images/${result.peserta.user.profile_picture}`,
          bimbingan_tambahan_id: bimbinganTambahan.id,
          status: bimbinganTambahan.status,
          date: bimbinganTambahan.tanggal,
          time: bimbinganTambahan.jam_bimbingan,
          attendance: bimbinganTambahan.absensi_peserta,
          pengajar_review: bimbinganTambahan.catatan_pengajar,
          link_meet: bimbinganTambahan.link_meet,
        };

        data.push(dataBimbinganTambahan);
      }
    }

    return data;
  }

  async progressPeserta(id, pengajarName, startDate, endDate) {
    const result = await this.__findAll(
      { where: { peserta_id: id } },
      this.#includeQueryProgressPeserta
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
      }
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
          attributes: ['tanggal', 'status'],
        },
        {
          model: BimbinganTambahan,
          as: 'bimbingan_tambahan',
          attributes: ['tanggal', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const result = period.map((data) => {
      const totalBimbinganRegulerFinished = data.bimbingan_reguler.filter(
        (bimbingan) => bimbingan.status === STATUS_BIMBINGAN_ACTIVE.FINISHED
      ).length;

      const totalBimbinganReguler = data.bimbingan_reguler.length;
      let start_date = data.bimbingan_reguler[0];
      let end_date = data.bimbingan_reguler[totalBimbinganReguler - 1];

      return {
        id: data.id,
        profile_picture: `${base_url}/images/${data.pengajar.user.profile_picture}`,
        pengajar_id: data.pengajar_id,
        nama: data.pengajar.user.nama,
        jenis_kelamin: data.pengajar.user.jenis_kelamin,
        hari_1: data.hari_1,
        jam_1: data.jam_1,
        hari_2: data.hari_2,
        jam_2: data.jam_2,
        tanggal_mulai_reguler: start_date ? start_date : null,
        tanggal_selesai_reguler: end_date ? end_date : null,
        total_attendance_reguler: totalBimbinganRegulerFinished,
        total_bimbingan_reguler: totalBimbinganReguler,
        tipe_bimbingan: data.tipe_bimbingan,
        status: data.status,
        infaq_bimbingan_tambahan_sebelum:
          data.bimbingan_tambahan.length > 0 ? data.bimbingan_tambahan[0].tanggal : null,
        telp_wa: data.pengajar.user.telp_wa,
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
      }
    );

    const period = await Period.findOne({
      where: { peserta_id: pesertaId[0].id, id: period_id },
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
          attributes: { exclude: ['updatedAt', 'createdAt'] },
        },
        {
          model: BimbinganTambahan,
          as: 'bimbingan_tambahan',
          attributes: { exclude: ['updatedAt', 'createdAt'] },
        },
      ],
      attributes: ['id', 'pengajar_id', 'tipe_bimbingan', 'status', 'tanggal_pengingat_infaq'],
    });

    let arrayPeriodeBimbingan = [];
    let arrayTotalAttendance = [];

    let tipeBimbingan = '';

    if (!period) {
      throw ApiError.badRequest('Data not found');
    }

    if (period.tipe_bimbingan == TYPE_BIMBINGAN.REGULER) {
      period.bimbingan_reguler.map((data) => {
        arrayPeriodeBimbingan.push(data.tanggal);

        if (data.status === STATUS_BIMBINGAN_ACTIVE.FINISHED) {
          arrayTotalAttendance.push(data.status);
        }
      });

      tipeBimbingan = TYPE_BIMBINGAN.REGULER;
    }

    if (period.tipe_bimbingan == TYPE_BIMBINGAN.TAMBAHAN) {
      period.bimbingan_tambahan.map((data) => {
        arrayPeriodeBimbingan.push(data.tanggal);
      });
      tipeBimbingan = TYPE_BIMBINGAN.TAMBAHAN;
    }

    const totalBimbinganReguler = period.bimbingan_reguler.length;
    return {
      id: period.id,
      profile_picture: `${base_url}/images/${period.pengajar.user.profile_picture}`,
      id_pengajar: period.pengajar_id,
      nama: period.pengajar.user.nama,
      jenis_kelamin: period.pengajar.user.jenis_kelamin,
      hari_1: period.hari_1,
      jam_1: period.jam_1,
      hari_2: period.hari_2,
      jam_2: period.jam_2,
      tanggal_mulai: arrayPeriodeBimbingan ? arrayPeriodeBimbingan[0] : null,
      tanggal_selesai: arrayPeriodeBimbingan
        ? arrayPeriodeBimbingan[arrayPeriodeBimbingan.length - 1]
        : null,
      jumlah_attedance_bimbingan_reguler: arrayTotalAttendance.length,
      total_bimbingan_reguler: totalBimbinganReguler,
      tipe_bimbingan: period.tipe_bimbingan,
      status: period.status,
      infaq_bimbingan_tambahan_sebelum:
        period.bimbingan_tambahan.length > 0 ? period.bimbingan_tambahan[0].tanggal : null,
      detail_bimbingan: period.bimbingan_reguler
        ? period.bimbingan_reguler
        : period.bimbingan_tambahan,
    };
  }

  async getCatatanBimbinganReguler(id) {
    const result = await BimbinganReguler.findOne({
      where: { id, status: STATUS_BIMBINGAN_ACTIVE.FINISHED },
      attributes: [
        'hari_bimbingan',
        'jam_bimbingan',
        'absensi_peserta',
        'absensi_pengajar',
        'catatan_pengajar',
      ],
    });

    if (!result) {
      throw ApiError.badRequest('Bimbingan Reguler not found');
    }

    return result;
  }

  async getCatatanBimbinganTambahan(id) {
    const result = await BimbinganTambahan.findOne({
      where: { id, status: STATUS_BIMBINGAN_ACTIVE.FINISHED },
      attributes: [
        'hari_bimbingan',
        'jam_bimbingan',
        'absensi_peserta',
        'absensi_pengajar',
        'catatan_pengajar',
      ],
    });

    if (!result) {
      throw ApiError.badRequest('Bimbingan Tambahan not found');
    }

    return result;
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
          as: 'user',
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

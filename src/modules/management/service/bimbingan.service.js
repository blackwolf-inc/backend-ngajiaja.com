const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const {
  Period,
  JadwalBimbinganPeserta,
  User,
  Peserta,
  BimbinganReguler,
  BimbinganTambahan,
} = require('../../../models');

class BimbinganService extends BaseService {
  async bimbinganOnGoing(id, pesertaName, level) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'ACTIVATED' } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.bimbingan_reguler !== null) {
        let attendance = 0;
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_peserta === 1) attendance += 1;
        }

        const bimbinganOnGoing = {
          period_id: period.id,
          peserta_id: period.peserta.id,
          user_id: period.peserta.User.id,
          bimbingan_reguler_id: bimbinganReguler.id,
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

      if (period.bimbingan_tambahan !== null) {
        let attendance = 0;
        for (const bimbinganTambahan of period.bimbingan_tambahan) {
          if (bimbinganTambahan.absensi_peserta === 1) attendance += 1;
        }

        const bimbinganOnGoing = {
          period_id: period.id,
          peserta_id: period.peserta.id,
          user_id: period.peserta.User.id,
          bimbingan_tambahan_id: bimbinganTambahan.id,
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
      { where: { pengajar_id: id, status: 'FINISHED' } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.bimbingan_reguler !== null) {
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

      if (period.bimbingan_tambahan !== null) {
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
}

module.exports = BimbinganService;

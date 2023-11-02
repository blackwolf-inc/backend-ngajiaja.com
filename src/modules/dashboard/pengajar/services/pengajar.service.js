const BaseService = require('../../../../base/base.service');
const ApiError = require('../../../../helpers/errorHandler');
const {
  BimbinganReguler,
  BimbinganTambahan,
  Peserta,
  JadwalBimbinganPeserta,
  User,
} = require('../../../../models');
const moment = require('moment');

class PengajarService extends BaseService {
  async getPengajarByUserId(id) {
    const result = await this.__findOne({ where: { user_id: id } });
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    return result;
  }

  async bimbinganPending(id, pesertaName) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'WAITING' } },
      this.#includeQueryBimbinganPending,
      'createdAt',
      'ASC',
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.peserta.jadwal_bimbingan_peserta === null) continue; // just for testing (dummy data), peserta must have jadwal bimbingan, so this line can be removed if the data is real
      const bimbinganPending = {
        period_id: period.id,
        peserta_id: period.peserta.id,
        user_id: period.peserta.User.id,
        category: period.tipe_bimbingan,
        name: period.peserta.User.nama,
        schedule: {
          day1: period.peserta.jadwal_bimbingan_peserta.hari_bimbingan_1,
          hour1: period.peserta.jadwal_bimbingan_peserta.jam_bimbingan_1,
          day2: period.peserta.jadwal_bimbingan_peserta.hari_bimbingan_2,
          hour2: period.peserta.jadwal_bimbingan_peserta.jam_bimbingan_2,
        },
        level: period.peserta.level,
        last_approved: moment(period.createdAt).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      };

      data.push(bimbinganPending);
    }

    if (pesertaName) {
      if (pesertaName.length < 3)
        throw ApiError.badRequest('Peserta name must be at least 3 characters');

      const filteredPeserta = data.filter((peserta) => {
        return peserta.name.includes(pesertaName);
      });
      if (filteredPeserta) {
        if (filteredPeserta.length === 0)
          throw ApiError.notFound(`Peserta with name ${pesertaName} not found`);

        return filteredPeserta;
      }
    }

    return data;
  }

  async bimbinganOnGoing(id, pesertaName, status) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'ACTIVATED' } },
      this.#includeQueryBimbinganOnGoing,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.bimbingan_reguler !== null) {
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_pengajar === 1 || bimbinganReguler.absensi_peserta === 1)
            continue;
          const bimbinganOnGoing = {
            period_id: period.id,
            peserta_id: period.peserta.id,
            user_id: period.peserta.User.id,
            bimbingan_reguler_id: bimbinganReguler.id,
            status: null, // no data in db, waiting for db update
            name: period.peserta.User.nama,
            date: null, // no data in db, waiting for db update
            time: bimbinganReguler.jam_bimbingan,
            level: period.peserta.level,
          };

          data.push(bimbinganOnGoing);
        }
      }

      if (period.bimbingan_tambahan !== null) {
        for (const bimbinganTambahan of period.bimbingan_tambahan) {
          if (bimbinganTambahan.absensi_pengajar === 1 || bimbinganTambahan.absensi_peserta === 1)
            continue;
          const bimbinganOnGoing = {
            period_id: period.id,
            peserta_id: period.peserta.id,
            user_id: period.peserta.User.id,
            bimbingan_tambahan_id: bimbinganTambahan.id,
            status: null, // no data in db, waiting for db update
            name: period.peserta.User.nama,
            date: null, // no data in db, waiting for db update
            time: bimbinganTambahan.jam_bimbingan,
            level: period.peserta.level,
          };

          data.push(bimbinganOnGoing);
        }
      }
    }

    let filteredPeserta;
    if (pesertaName) {
      if (pesertaName.length < 3)
        throw ApiError.badRequest('Peserta name must be at least 3 characters');

      if (status) {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.includes(pesertaName) && peserta.status === status;
        });
      } else {
        filteredPeserta = data.filter((peserta) => {
          return peserta.name.includes(pesertaName);
        });
      }
    }

    if (status) {
      filteredPeserta = data.filter((peserta) => {
        return peserta.status === status;
      });
    }

    if (filteredPeserta) {
      if (filteredPeserta.length === 0) throw ApiError.notFound(`Peserta not found`);

      return filteredPeserta;
    }

    return data; // data returned is not sorted by date because there is no date data in db
  }

  async getBimbinganActivated(id) {
    const result = await this.bimbinganOnGoing(id);
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    return result.length;
  }

  async getAbsent(id) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'ACTIVATED' } },
      this.#includeQueryBimbinganOnGoing,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    let totalAbsent = 0;
    for (const period of result.datas) {
      for (const bimbingan of period.bimbingan_reguler) {
        if (bimbingan.absensi_pengajar === 0) totalAbsent += 1;
      }

      for (const bimbingan of period.bimbingan_tambahan) {
        if (bimbingan.absensi_pengajar === 0) totalAbsent += 1;
      }
    }

    return totalAbsent;
  }

  async getIncome(id) {
    const result = await this.getAll({ pengajar_id: id, status: 'ACCEPTED' });
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    let totalIncome = 0;
    for (const infaq of result.datas) {
      totalIncome += infaq.nominal;
    }

    return totalIncome;
  }

  #includeQueryBimbinganPending = [
    {
      model: Peserta,
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
  ];

  #includeQueryBimbinganOnGoing = [
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
}

module.exports = PengajarService;

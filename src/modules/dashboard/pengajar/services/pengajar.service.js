const BaseService = require('../../../../base/base.service');
const ApiError = require('../../../../helpers/errorHandler');
const { TYPE_BIMBINGAN, STATUS_BIMBINGAN } = require('../../../../helpers/constanta');
const { BimbinganReguler, BimbinganTambahan, Peserta, User } = require('../../../../models');
const moment = require('moment');

class PengajarService extends BaseService {
  async getPengajarByUserId(id) {
    const result = await this.__findOne({ where: { user_id: id } });
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    return result;
  }

  async bimbinganPending(id, pesertaName) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.WAITING } },
      this.#includeQuery,
      'createdAt',
      'ASC',
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const bimbinganOnGoing = await this.__findAll(
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.ACTIVATED } },
      this.#includeQuery,
    );

    const data = [];
    for (const period of result.datas) {
      const lastApproved = moment(period.createdAt).add(1, 'days').format('YYYY-MM-DD HH:mm:ss');
      let isSameJadwal;

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        isSameJadwal = this.#checkSameJadwal(period, bimbinganOnGoing.datas);
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        isSameJadwal = this.#checkSameJadwal(period, bimbinganOnGoing.datas);
      }

      // check if last approved is passed or have same jadwal with bimbingan on going
      if (moment().isAfter(lastApproved) || isSameJadwal) {
        await this.updateData({ status: STATUS_BIMBINGAN.CANCELED }, { id: period.id });
        continue;
      }

      const bimbinganPending = {
        period_id: period.id,
        peserta_id: period.peserta.id,
        user_id: period.peserta.User.id,
        schedule: {
          day1: null,
          hour1: null,
          day2: null,
          hour2: null,
        },
        category: period.tipe_bimbingan,
        name: period.peserta.User.nama,
        level: period.peserta.level,
        last_approved: lastApproved,
      };

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        bimbinganPending.schedule.day1 = period.bimbingan_reguler[0].hari_bimbingan;
        bimbinganPending.schedule.hour1 = period.bimbingan_reguler[0].jam_bimbingan;
        bimbinganPending.schedule.day2 = period.bimbingan_reguler[1].hari_bimbingan;
        bimbinganPending.schedule.hour2 = period.bimbingan_reguler[1].jam_bimbingan;
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        bimbinganPending.schedule.day1 = period.bimbingan_tambahan[0].hari_bimbingan;
        bimbinganPending.schedule.hour1 = period.bimbingan_tambahan[0].jam_bimbingan;
        bimbinganPending.schedule.day2 = period.bimbingan_tambahan[1].hari_bimbingan;
        bimbinganPending.schedule.hour2 = period.bimbingan_tambahan[1].jam_bimbingan;
      }

      data.push(bimbinganPending);
    }

    // check if peserta name is provided for filtering
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
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.ACTIVATED } },
      this.#includeQuery,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    const data = [];
    for (const period of result.datas) {
      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
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
            date: bimbinganReguler.tanggal,
            time: bimbinganReguler.jam_bimbingan,
            level: period.peserta.level,
          };

          data.push(bimbinganOnGoing);
        }
      }

      if (period.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
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
            date: bimbinganTambahan.tanggal,
            time: bimbinganTambahan.jam_bimbingan,
            level: period.peserta.level,
          };

          data.push(bimbinganOnGoing);
        }
      }
    }

    // sort data by date ascending
    const sortedData = data.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    let filteredPeserta;
    if (pesertaName) {
      if (pesertaName.length < 3)
        throw ApiError.badRequest('Peserta name must be at least 3 characters');

      if (status) {
        filteredPeserta = sortedData.filter((peserta) => {
          return peserta.name.includes(pesertaName) && peserta.status === status;
        });
      } else {
        filteredPeserta = sortedData.filter((peserta) => {
          return peserta.name.includes(pesertaName);
        });
      }
    }

    if (status) {
      filteredPeserta = sortedData.filter((peserta) => {
        return peserta.status === status;
      });
    }

    if (filteredPeserta) {
      if (filteredPeserta.length === 0) throw ApiError.notFound(`Peserta not found`);

      return filteredPeserta;
    }

    return sortedData;
  }

  async getBimbinganActivated(id) {
    const result = await this.bimbinganOnGoing(id);
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    return result.length;
  }

  async getAbsent(id) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: STATUS_BIMBINGAN.ACTIVATED } },
      this.#includeQuery,
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

  #checkSameJadwal(period, dataOnGoing) {
    let isSameJadwal = false;
    for (const bimbingan of dataOnGoing) {
      if (bimbingan.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        for (let i = 0; i < 2; i++) {
          if (
            period.bimbingan_reguler[i].hari_bimbingan ===
            bimbingan.bimbingan_reguler[i].hari_bimbingan
          ) {
            if (
              period.bimbingan_reguler[i].jam_bimbingan ===
              bimbingan.bimbingan_reguler[i].jam_bimbingan
            ) {
              isSameJadwal = true;
            }
          }
        }
      }

      if (bimbingan.tipe_bimbingan === TYPE_BIMBINGAN.TAMBAHAN) {
        for (let i = 0; i < 2; i++) {
          if (
            period.bimbingan_reguler[i].hari_bimbingan ===
            bimbingan.bimbingan_tambahan[i].hari_bimbingan
          ) {
            if (
              period.bimbingan_reguler[i].jam_bimbingan ===
              bimbingan.bimbingan_tambahan[i].jam_bimbingan
            ) {
              isSameJadwal = true;
            }
          }
        }
      }
    }

    return isSameJadwal;
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
}

module.exports = PengajarService;

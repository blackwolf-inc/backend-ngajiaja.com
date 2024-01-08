const BaseService = require('../../../../base/base.service');
const ApiError = require('../../../../helpers/errorHandler');
const {
  TYPE_BIMBINGAN,
  STATUS_BIMBINGAN,
  STATUS_BIMBINGAN_ACTIVE,
} = require('../../../../helpers/constanta');
const {
  BimbinganReguler,
  BimbinganTambahan,
  Peserta,
  Pengajar,
  User,
  Pencairan,
  PenghasilanPengajar,
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

      const base_url = process.env.BASE_URL;

      const bimbinganPending = {
        period_id: period.id,
        peserta_id: period.peserta.id,
        user_id: period.peserta.user.id,
        no_telp: period.peserta.user.telp_wa,
        profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
        schedule: {
          day1: null,
          hour1: null,
          day2: null,
          hour2: null,
        },
        category: period.tipe_bimbingan,
        name: period.peserta.user.nama,
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
        return peserta.name.toLowerCase().includes(pesertaName.toLowerCase());
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

    const base_url = process.env.BASE_URL;

    const data = [];
    for (const period of result.datas) {
      if (period.tipe_bimbingan === TYPE_BIMBINGAN.REGULER) {
        for (const bimbinganReguler of period.bimbingan_reguler) {
          if (bimbinganReguler.absensi_pengajar === 1 || bimbinganReguler.absensi_peserta === 1)
            continue;
          const bimbinganOnGoing = {
            period_id: period.id,
            peserta_id: period.peserta.id,
            user_id: period.peserta.user.id,
            no_telp: period.peserta.user.telp_wa,
            profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
            bimbingan_reguler_id: bimbinganReguler.id,
            status: bimbinganReguler.status,
            link_meet: bimbinganReguler.link_meet,
            name: period.peserta.user.nama,
            date: bimbinganReguler.tanggal,
            time: bimbinganReguler.jam_bimbingan,
            level: period.peserta.level,
          };

          // if (!bimbinganReguler.link_meet) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.NOT_SET;
          // }

          // if (bimbinganReguler.link_meet && moment().isBefore(bimbinganOnGoing.date)) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.WAITING;
          // }

          // if (
          //   bimbinganReguler.link_meet &&
          //   !bimbinganReguler.catatan_pengajar &&
          //   moment().isAfter(moment(bimbinganOnGoing.date).add(1, 'hours'))
          // ) {
          //   bimbinganOnGoing.status = `${STATUS_BIMBINGAN_ACTIVE.WAITING} (LATE)`;
          // }

          // if (bimbinganReguler.tanggal_baru && bimbinganReguler.jam_baru) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.RESCHEDULE;
          // }

          // if (bimbinganReguler.persetujuan_peserta === 0) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.CANCELED;
          // }

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
            user_id: period.peserta.user.id,
            no_telp: period.peserta.user.telp_wa,
            profile_picture: `${base_url}/images/${period.peserta.user.profile_picture}`,
            bimbingan_tambahan_id: bimbinganTambahan.id,
            status: bimbinganTambahan.status,
            link_meet: bimbinganTambahan.link_meet,
            name: period.peserta.user.nama,
            date: bimbinganTambahan.tanggal,
            time: bimbinganTambahan.jam_bimbingan,
            level: period.peserta.level,
          };

          // if (!bimbinganTambahan.link_meet) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.NOT_SET;
          // }

          // if (bimbinganTambahan.link_meet && moment().isBefore(bimbinganOnGoing.date)) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.WAITING;
          // }

          // if (
          //   bimbinganTambahan.link_meet &&
          //   !bimbinganTambahan.catatan_pengajar &&
          //   moment().isAfter(moment(bimbinganOnGoing.date).add(1, 'hours'))
          // ) {
          //   bimbinganOnGoing.status = `${STATUS_BIMBINGAN_ACTIVE.WAITING} (LATE)`;
          // }

          // if (bimbinganTambahan.tanggal_baru && bimbinganTambahan.jam_baru) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.RESCHEDULE;
          // }

          // if (bimbinganTambahan.persetujuan_peserta === 0) {
          //   bimbinganOnGoing.status = STATUS_BIMBINGAN_ACTIVE.CANCELED;
          // }

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
          return (
            peserta.name.toLowerCase().includes(pesertaName.toLowerCase()) &&
            peserta.status === status
          );
        });
      } else {
        filteredPeserta = sortedData.filter((peserta) => {
          return peserta.name.toLowerCase().includes(pesertaName.toLowerCase());
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

  async postDataRekening(id, data) {
    const result = await this.updateData(data, { id });
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    return result;
  }

  async postPencairanPengajar(data) {
    const pengajar = await Pengajar.findOne({ where: { id: data.pengajar_id } });

    if (!pengajar) {
      throw new Error('Pengajar not found');
    }

    if (!pengajar.nama_bank || !pengajar.no_rekening || !pengajar.nama_rekening) {
      throw new Error('Bank details are incomplete');
    }

    const totalPenghasilan = await PenghasilanPengajar.sum('penghasilan', {
      where: { pengajar_id: data.pengajar_id },
    });
    const totalPencairan = await Pencairan.sum('nominal', {
      where: {
        pengajar_id: data.pengajar_id,
        status: 'ACCEPTED',
      },
    });

    if (totalPenghasilan - totalPencairan - data.nominal < 0) {
      throw new Error('Insufficient funds');
    }

    const pencairanData = {
      pengajar_id: data.pengajar_id,
      nominal: data.nominal,
      status: 'WAITING',
      nama_bank: pengajar.nama_bank,
      no_rekening: pengajar.no_rekening,
      nama_rekening: pengajar.nama_rekening,
      user_id: pengajar.user_id,
    };

    const result = await Pencairan.create(pencairanData);

    return result;
  }
}

module.exports = PengajarService;

var moment = require('moment');
const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { Period, BimbinganReguler, BimbinganTambahan, Pengajar } = require('../../../models');

class PilihPengajar extends BaseService {
  async checkDays(hari_1, hari_2) {
    const arrayDays = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'];
    let indexDay1 = 0;
    let indexDay2 = 0;

    let days = '';

    for (let i = 0; i < 2; i++) {
      if (i == 0) {
        days = hari_1;
      } else {
        days = hari_2;
      }

      for (let i = 0; i < arrayDays.length; i++) {
        if (arrayDays[i] == hari_1) {
          indexDay1 = i;
        } else if (arrayDays[i] == hari_2) {
          indexDay2 = i;
        }
      }
      if (indexDay1 > indexDay2) {
        throw ApiError.badRequest(`Invalid date first day: ${hari_1} > last day: ${hari_2}`);
      }
    }
  }

  async getAllPengajar(hari_1, jam_1, hari_2, jam_2) {
    let query1 = {};
    let query2 = {};

    if (hari_1 && jam_1) {
      query1 = {
        hari_mengajar: hari_1,
        mulai_mengajar: jam_1,
      };
    }

    if (hari_2 && jam_2) {
      query2 = {
        hari_mengajar: hari_2,
        mulai_mengajar: jam_2,
      };
    }

    if (Object.keys(query1).length == 0 && Object.keys(query2).length == 0) {
      const allData = await this.__findAll({}, this.#includeQuery);

      return allData;
    }

    const [result1, result2] = await Promise.all([
      this.__findAll({ where: query1 }, this.#includeQuery),
      this.__findAll({ where: query2 }, this.#includeQuery),
    ]);
    const data = [result1, result2];

    return data;
  }

  async createPeriode(payload) {
    await this.checkDays(payload.hari_1, payload.hari_2);
    const createPeriod = await this.__create(payload);

    return createPeriod;
  }

  async createBimbinganReguler(id, tanggal_pengingat_infaq, hari_1, jam_1, hari_2, jam_2) {
    const records = [];
    const dateNow = moment(new Date()).format('YYYY-MM-DD');
    const dateVerifikasi = moment(dateNow).add('days', 4).format('YYYY-MM-DD');
    const dateEnd = moment(dateVerifikasi).endOf('month').format('YYYY-MM-DD');
    const dateRemember = moment(tanggal_pengingat_infaq).format('YYYY-MM-DD');
    const dateDiff = moment(dateEnd).diff(dateVerifikasi, 'days');

    let dateThisMonth = dateVerifikasi;
    for (let i = 1; i <= dateDiff; i++) {
      if (hari_1 == moment(dateThisMonth).format('dddd')?.toUpperCase()) {
        const query = {
          period_id: id,
          tanggal_pengingat_infaq: dateRemember,
          tanggal: moment(dateThisMonth).format('YYYY-MM-DD'),
          hari_bimbingan: hari_1,
          jam_bimbingan: jam_1,
        };
        const result = await BimbinganReguler.create(query);
        records.push(result);
        dateThisMonth = moment(dateThisMonth).add('days', 1).format('YYYY-MM-DD');
      } else if (hari_2 == moment(dateThisMonth).format('dddd')?.toUpperCase()) {
        const query = {
          period_id: id,
          tanggal_pengingat_infaq: dateRemember,
          tanggal: moment(dateThisMonth).format('YYYY-MM-DD'),
          hari_bimbingan: hari_2,
          jam_bimbingan: jam_2,
        };
        const result = await BimbinganReguler.create(query);
        records.push(result);
        dateThisMonth = moment(dateThisMonth).add('days', 1).format('YYYY-MM-DD');
      } else {
        dateThisMonth = moment(dateThisMonth).add('days', 1).format('YYYY-MM-DD');
      }
    }

    return records;
  }

  async createBimbinganTambahan(id, hari_bimbingan, jam_bimbingan) {
    const query = {
      period_id: id,
      hari_bimbingan,
      jam_bimbingan,
    };

    const result = await BimbinganTambahan.create(query);

    return result;
  }

  // async updateTanggal(id) {
  //   const prefDaysSet = new Set();
  //   const userPrefDays = await Period.findOne({
  //     where: { id },
  //     include: [
  //       {
  //         model: BimbinganReguler,
  //         as: 'bimbingan_reguler',
  //       },
  //     ],
  //   });

  //   userPrefDays.bimbingan_reguler.forEach((element) => {
  //     prefDaysSet.add(element.hari_bimbingan);
  //   });

  //   const arrayDaysSet = Array.from(prefDaysSet);

  //   const userPrefDay1 = arrayDaysSet[0];
  //   const userPrefDay2 = arrayDaysSet[1];

  //   // return {
  //   //   userPrefDay1,
  //   //   userPrefDay2,
  //   // };
  //   // const mentorAcceptanceDay = new Date();
  // }

  #includeQuery = [
    {
      model: Pengajar,
      as: 'pengajar',
    },
  ];
}

module.exports = PilihPengajar;

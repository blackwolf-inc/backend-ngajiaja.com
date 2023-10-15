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

    if (Object.keys(query1).length === 0 && Object.keys(query2).length === 0) {
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
    const createPeriod = await Period.create(payload);

    return createPeriod;
  }

  async createBimbinganReguler(id, tanggal_pengingat_infaq, hari_1, jam_1, hari_2, jam_2) {
    const records = [];

    const dateString = tanggal_pengingat_infaq;

    const dateParts = dateString.split('-');

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    const dateObject = new Date(year, month, day);
    const dateOnly = new Date(
      dateObject.getFullYear(),
      dateObject.getMonth(),
      dateObject.getDate()
    );

    for (let i = 0; i < 4; i++) {
      if (hari_1 && jam_1) {
        const query = {
          period_id: id,
          tanggal_pengingat_infaq: dateOnly,
          hari_bimbingan: hari_1,
          jam_bimbingan: jam_1,
        };

        const result = await BimbinganReguler.create(query);
        records.push(result);
      }
    }

    for (let i = 0; i < 4; i++) {
      if (hari_2 && jam_2) {
        const query = {
          period_id: id,
          tanggal_pengingat_infaq: dateOnly,
          hari_bimbingan: hari_2,
          jam_bimbingan: jam_2,
        };

        const result = await BimbinganReguler.create(query);
        records.push(result);
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

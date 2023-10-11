const BaseService = require('../../../base/base.service');
const { Period, BimbinganReguler, BimbinganTambahan } = require('../../../models');

class PilihPengajar extends BaseService {
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
      const allData = await this.getAll({});
      return allData;
    }

    const [result1, result2] = await Promise.all([this.getAll(query1), this.getAll(query2)]);
    const data = [result1, result2];

    return data;
  }

  async createPeriode(payload) {
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
}

module.exports = PilihPengajar;

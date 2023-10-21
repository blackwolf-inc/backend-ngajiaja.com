const BaseService = require('../../../base/base.service');
const {
  JadwalMengajarPengajar,
  Pengajar,
  Peserta,
  BimbinganReguler,
  BimbinganTambahan,
} = require('../../../models');

class BimbinganService extends BaseService {
  async getAllPeriod(req) {
    let query = {
      where: req,
    };
    const result = await this.__findAll(query, [
      { model: Peserta, as: 'peserta' },
      { model: Pengajar, as: 'pengajar' },
      { model: BimbinganReguler, as: 'bimbingan_reguler' },
      { model: BimbinganTambahan, as: 'bimbingan_tambahan' },
    ]);

    return result;
  }

  async getOnePeriod(req) {
    let query = {
      where: { id: req },
    };

    const result = await this.__findOne(query, [
      { model: Peserta, as: 'peserta' },
      { model: Pengajar, as: 'pengajar' },
      { model: BimbinganReguler, as: 'bimbingan_reguler' },
      { model: BimbinganTambahan, as: 'bimbingan_tambahan' },
    ]);

    return result;
  }
}

module.exports = BimbinganService;

const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const {
  User,
  Bank,
  Infaq,
  Period,
  Peserta,
  Pengajar,
  PenghasilanPengajar,
} = require('../../../models');

class InfaqService extends BaseService {
  async checkUserById(payload) {
    const result = await User.findOne({ id: payload.user_id });
    if (!result) throw ApiError.notFound(`User with id ${id} not found`);
    return result;
  }
  async checkPesertaById(payload) {
    let id = payload.peserta_id;
    const result = await Peserta.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Peserta with id ${id} not found`);
    return result;
  }
  async checkPengajarById(payload) {
    let id = payload.pengajar_id;
    const result = await Pengajar.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Pengajar with id ${id} not found`);
    return result;
  }
  async checkBankById(payload) {
    let id = payload.bank_id;
    const result = await Bank.findOne({ id });
    if (!result) throw ApiError.notFound(`Bank with id ${id} not found`);
    return result;
  }
  async checkPeriodById(payload) {
    let id = payload.periode_id;
    const result = await Period.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);
    return result;
  }
  async checkInfaqById(id) {
    const result = await Infaq.findOne({ id });
    if (!result) throw ApiError.notFound(`Infaq with id ${id} not found`);
    return result;
  }

  async getAllInfaqByUserId(req) {
    let query;
    if (req.role == 'PESERTA') {
      query = {
        peserta_id: req.user.id,
      };
    } else if (req.role == 'PENGAJAR') {
      query = {
        pengajar_id: req.user.id,
      };
    } else {
      query = {};
    }
    const result = await this.getAll(query);
    return result;
  }

  async updateImages(req) {
    if (req.file) {
      const imageUrl = `${req.file.filename}`;
      req.body.bukti_pembayaran = imageUrl;
    } else {
      throw ApiError.badRequest(`Image not found`);
    }
  }

  async updateDateNow(req) {
    if (req) {
      req.body.waktu_pembayaran = Date.now();
    } else {
      throw ApiError.badRequest('Invalid Date');
    }
  }

  async addToPenghasilanPengajar(req) {
    const penguranganPenghasilan = (50 / 100) * parseFloat(req.nominal);

    const data = {
      pengajar_id: req.pengajar_id,
      peserta_id: req.peserta_id,
      pembayaran: req.nominal,
      penghasilan: parseFloat(req.nominal) - penguranganPenghasilan,
      persentase_bagi_hasil: 50,
      waktu_pembayaran: req.waktu_pembayaran,
    };
    const result = await PenghasilanPengajar.create(data);
  }
}

module.exports = InfaqService;

const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { User, Bank, Infaq, Period } = require('../../../models');

class InfaqService extends BaseService {
  async checkUserById(payload) {
    const result = await User.findOne({ id: payload.user_id });
    if (!result) throw ApiError.notFound(`User with id ${id} not found`);
    return result;
  }
  async checkBankById(payload) {
    const result = await Bank.findOne({ id: payload.bank_id });
    if (!result) throw ApiError.notFound(`Bank with id ${id} not found`);
    return result;
  }
  async checkPeriodById(payload) {
    const result = await Period.findOne({ id: payload.period_id });
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);
    return result;
  }
  async checkInfaqById(id) {
    const result = await Infaq.findOne({ id });
    if (!result) throw ApiError.notFound(`Infaq with id ${id} not found`);
    return result;
  }
  async getAllInfaqByUserId(id) {
    const query = {
      user_id: id,
    };
    const result = await this.getAll(query);
    return result;
  }
  async changeImages(req) {
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
}

module.exports = InfaqService;

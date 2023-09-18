const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { User, Bank, Pencairan } = require('../../../models');

class PencairanService extends BaseService {
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
  async checkPencairanById(id) {
    const result = await Pencairan.findOne({ id });
    if (!result) throw ApiError.notFound(`Pencairan with id ${id} not found`);
    return result;
  }
  async getAllPencairanByUserId(id) {
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
      req.body.status = 'null';
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

module.exports = PencairanService;

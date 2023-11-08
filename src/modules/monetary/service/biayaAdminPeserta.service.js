const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const formatTanggal = require('../../../utils/formatTime');
const { User, Bank } = require('../../../models');

class BiayaAdminPesertaService extends BaseService {
  async checkUserId(req) {
    const data = await User.findOne({ where: { id: req.body.user_id } });
    if (!data) {
      throw ApiError.badRequest(`user not found`);
    }
  }

  async updateUser(req) {
    const data = await User.update({ status: 'ADMINISTRATION' }, { where: { id: req.body.user_id } });
    console.log(data[0]);
    if (data[0] === 0) {
      throw ApiError.badRequest(`failed update status user_id ${req.body.user_id}`);
    }
  }

  async getOneIncludeDate(req) {
    const data = await this.__findOne({ where: { user_id: req.user.id } });
    if (data) {
      const tanggal = formatTanggal(data.createdAt);

      delete data.createdAt;
      delete data.updatedAt;
      data.tanggal = tanggal;
      return data;
    } else {
      throw ApiError.badRequest(
        `failed get one data biaya administrasi with user_id ${req.user.id}`
      );
    }
  }

  async checkBankId(req) {
    const data = await Bank.findOne({ where: { id: req.body.bank_id } });
    if (!data) {
      throw ApiError.badRequest(`Bank not found`);
    }
  }

  async checkDuplicateUserId(req) {
    const data = await this.__findOne({ where: { user_id: req.body.user_id } });
    if (data) {
      throw ApiError.badRequest(`Peserta for user_id ${data.user_id} already exist`);
    }
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
}

module.exports = BiayaAdminPesertaService;

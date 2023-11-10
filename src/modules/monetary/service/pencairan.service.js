const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { User, Bank, Pencairan } = require('../../../models');
const { STATUS_PENCAIRAN } = require('../../../helpers/constanta');
const moment = require('moment');

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
  async getAllPencairanByUserId(id, startDate, endDate, status) {
    const query = {
      user_id: id,
    };
    const result = await this.getAll(query);

    let filteredData;
    if (startDate && endDate) {
      if (status) {
        filteredData = result.datas.filter(
          (item) =>
            moment(item.waktu_pembayaran) >= moment(startDate) &&
            moment(item.waktu_pembayaran) <= moment(endDate) &&
            item.status === status,
        );
      } else {
        filteredData = result.datas.filter(
          (item) =>
            moment(item.waktu_pembayaran) >= moment(startDate) &&
            moment(item.waktu_pembayaran) <= moment(endDate),
        );
      }
    }

    if (status) {
      filteredData = result.datas.filter((item) => item.status === status);
    }

    if (filteredData) {
      if (filteredData.length === 0) throw ApiError.notFound(`Pencairan not found`);

      return filteredData;
    }

    return result.datas;
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

  async totalPencairan(id) {
    const result = await this.getAll({ user_id: id, status: STATUS_PENCAIRAN.ACCEPTED });
    if (!result) throw ApiError.notFound(`User with id ${id} not found`);

    let total = 0;
    for (const item of result.datas) {
      total += item.nominal;
    }

    return total;
  }
}

module.exports = PencairanService;

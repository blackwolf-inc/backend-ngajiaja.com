const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { Bank } = require('../../../models');
const { Op, fn } = require('sequelize');

class BankService extends BaseService {
  async checkBankDuplicate(req) {
    const result = await Bank.findOne({
      where: {
        [Op.or]: [{ nama_bank: { [Op.like]: fn('LOWER', `%${req}%`) } }],
      },
    });

    if (result) {
      throw ApiError.badRequest(`Bank with name ${req} already exist`);
    }

    return result;
  }
}

module.exports = BankService;

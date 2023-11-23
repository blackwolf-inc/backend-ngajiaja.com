const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { Bank } = require('../../../models');
const { Op, fn, sequelize, where } = require('sequelize');

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

  async updateBank(payload, id) {
    const checkDuplicate = await Bank.findOne({
      where: {
        id: {
          [Op.ne]: id,
        },
        [Op.or]: [{ nama_bank: { [Op.like]: fn('LOWER', `%${payload.nama_bank}%`) } }],
      },
    });

    if (checkDuplicate) {
      throw ApiError.badRequest(`Bank with name ${payload.nama_bank} already exists`);
    }

    const [updatedCount] = await Bank.update(payload, {
      where: { id },
    });

    if (updatedCount > 0) {
      const afterUpdateData = await this.getOneById(id);
      return afterUpdateData;
    } else {
      throw new Error(`Failed update ${this.db.name}`);
    }
  }

  async getPengajarBank(id) {
    console.log(id);
    const result = await this.getOneById(id);
    if (!result) throw ApiError.badRequest(`Penganjar with id ${id} not found`);

    return {
      bank_name: result.nama_bank,
      account_number: result.no_rekening,
      owner_name: result.nama_rekening,
    };
  }
}

module.exports = BankService;

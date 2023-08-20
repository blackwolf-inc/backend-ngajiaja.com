const { validationResult } = require('express-validator');
const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { User } = require('../../../models');

class StudentService extends BaseService {
  async checkUserId(req) {
    const data = await User.findOne({ where: { id: req.body.user_id } });
    if (!data) {
      throw ApiError.badRequest(`user not found`);
    }
  }

  async checkDuplicateUserId(req) {
    const data = await this.__findOne({ where: { user_id: req.body.user_id } });
    if (data) {
      throw ApiError.badRequest(`Peserta for user_id ${data.user_id} already exist`);
    }
  }
}

module.exports = StudentService;

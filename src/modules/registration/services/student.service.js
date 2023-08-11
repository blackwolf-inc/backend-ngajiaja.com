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
}

module.exports = StudentService;

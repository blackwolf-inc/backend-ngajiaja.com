const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');

class UserService extends BaseService {
  async getUserByEmail(email) {
    const data = await this.__findOne({ where: { email } });
    if (!data) {
      throw ApiError.badRequest(`Email ${email} not found`);
    }

    return data;
  }
}

module.exports = UserService;

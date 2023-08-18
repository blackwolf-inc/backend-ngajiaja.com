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

  async roleCreationUser() {
    if (this.req.user && this.req.user.role !== 'ADMIN' && this.req.body.role === 'ADMIN') {
      throw ApiError.badRequest('You can not create ADMIN role');
    }
  }
}

module.exports = UserService;

const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { User, Pengajar } = require('../../../models');

class TeacherService extends BaseService {
  async checkUser(id) {
    const result = await User.findOne({ where: { id } });
    if (!result) throw ApiError.notFound('User not found');
  }

  async checkTeacherDuplicate(id) {
    const result = await Pengajar.findOne({ where: { user_id: id } });
    if (result) throw ApiError.badRequest('Data duplicated');
  }
}

module.exports = TeacherService;

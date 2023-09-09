const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const SendEmailNotification = require('../../../utils/nodemailer');
const { User, Peserta } = require('../../../models');

class StudentService extends BaseService {
  async checkUserId(req) {
    const data = await User.findOne({ where: { id: req.body.user_id } });
    if (!data) {
      throw ApiError.badRequest(`user not found`);
    }
  }

  async checkPesertaId(req) {
    const data = await Peserta.findOne({ where: { id: req.body.peserta_id } });
    if (!data) {
      throw ApiError.badRequest(`Peserta not found`);
    }
  }

  async checkDuplicateUserId(req) {
    const data = await this.__findOne({ where: { user_id: req.body.user_id } });
    if (data) {
      throw ApiError.badRequest(`Peserta for user_id ${data.user_id} already exist`);
    }
  }

  async sendNotificationEmail(email, name) {
    const getHtml = await SendEmailNotification.getHtml('notifikasiPeserta.ejs', { name });
    return SendEmailNotification.sendMail(email, 'Register Peserta Notification', getHtml);
  }
}

module.exports = StudentService;

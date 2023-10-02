const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const SendEmailNotification = require('../../../utils/nodemailer');
const moment = require('moment');
const { User, Pengajar } = require('../../../models');

class TeacherService extends BaseService {
  async createTeacher(payload) {
    const dateString = payload.tanggal_wawancara;
    const dateObject = moment(dateString, 'DD-MM-YYY').toDate();
    const formattedDate = moment(dateObject).format('DD-MM-YYYY');

    const timeString = payload.jam_wawancara;
    const timeObject = moment(timeString, 'HH:mm').format('HH:mm:ss');

    payload.tanggal_wawancara = formattedDate;
    payload.jam_wawancara = timeObject;

    const createdTeacher = await this.createData(payload);

    return createdTeacher;
  }

  async updateTeacherByUserId(payload, id) {
    await this.getTeacherByUserId(id);

    if (payload.tanggal_wawancara) {
      const dateString = payload.tanggal_wawancara;
      const dateObject = moment(dateString, 'DD-MM-YYYY').toDate();
      const formattedDate = moment(dateObject).format('DD-MM-YYYY');
      payload.tanggal_wawancara = formattedDate;
    }

    if (payload.jam_wawancara) {
      const timeString = payload.jam_wawancara;
      const timeObject = moment(timeString, 'HH:mm').format('HH:mm:ss');
      payload.jam_wawancara = timeObject;
    }

    const updatedTeacher = await Pengajar.update(payload, { where: { user_id: id } });

    return updatedTeacher;
  }

  async deleteTeacherByUserId(id) {
    await this.getTeacherByUserId(id);
    const dataDeleted = await Pengajar.destroy({ where: { user_id: id } });
    return dataDeleted;
  }

  async checkUser(id) {
    const result = await User.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`User with id ${id} not found`);

    return result;
  }

  async getTeacherByUserId(id) {
    const result = await Pengajar.findOne({ where: { user_id: id } });
    if (!result) throw ApiError.notFound(`Pengajar with id ${id} not found`);

    return result;
  }

  async checkTeacherDuplicate(id) {
    const result = await Pengajar.findOne({ where: { user_id: id } });
    if (result) throw ApiError.badRequest(`Pengajar with user_id ${id} already exist`);

    return result;
  }

  async sendNotificationEmail(email, name) {
    const getHtml = await SendEmailNotification.getHtml('notifikasiPengajar.ejs', {
      email,
      name,
    });
    return SendEmailNotification.sendMail(email, 'Register Pengajar Notification', getHtml);
  }
}

module.exports = TeacherService;

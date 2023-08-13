const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const SendEmailNotification = require('../../../utils/nodemailer');
const Validator = require('fastest-validator');
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

  async inputValidation(req) {
    const schema = {
      user_id: { type: 'integer' },
      user_id: { type: 'integer' },
      pendidikan_terakhir: { type: 'string', optional: false },
      punya_sertifikasi_guru_quran: { type: 'number', enum: [0, 1] },
      background_pendidikan_quran: { type: 'string', optional: false },
      pengalaman_mengajar: { type: 'string', optional: false },
      pernah_mengajar_online: { type: 'number', enum: [0, 1] },
      paham_aplikasi_meet: { type: 'number', enum: [0, 1] },
      hafalan_quran: { type: 'string', optional: false },
      siap_komitmen: { type: 'number', enum: [0, 1] },
      jam_mengajar: { type: 'string', optional: false },
      mengajar_hari_libur: { type: 'number', enum: [0, 1] },
      bagi_hasil_50persen: { type: 'number', enum: [0, 1] },
    };

    const v = new Validator();
    const validation = v.compile(schema);

    const validationResult = validation(req.body);

    if (!validationResult) return validationResult;

    return true;
  }

  async sendNotificationEmail(email, name) {
    const getHtml = await SendEmailNotification.getHtml('notifikasiPengajar.ejs', {
      email,
      name,
    });
    SendEmailNotification.sendMail(email, 'Register Pengajar Notification', getHtml);
  }
}

module.exports = TeacherService;

const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const SendEmailNotification = require('../../../utils/nodemailer');
const Validator = require('fastest-validator');
const { User, Pengajar } = require('../../../models');

class TeacherService extends BaseService {
  async checkUser(id) {
    const result = await User.findOne({ where: { id } });
    if (!result) throw ApiError.notFound('User not found');

    return result;
  }

  async checkTeacherDuplicate(id) {
    const result = await Pengajar.findOne({ where: { user_id: id } });
    if (result) throw ApiError.badRequest('Data duplicated');

    return result;
  }

  async inputValidation(req) {
    const schema = {
      user_id: { type: 'number' },
      pendidikan_terakhir: { type: 'string', optional: false },
      punya_sertifikasi_guru_quran: { type: 'enum', values: [0, 1] },
      background_pendidikan_quran: { type: 'string', optional: false },
      pengalaman_mengajar: { type: 'string', optional: false },
      pernah_mengajar_online: { type: 'enum', values: [0, 1] },
      paham_aplikasi_meet: { type: 'enum', values: [0, 1] },
      hafalan_quran: { type: 'string', optional: false },
      siap_komitmen: { type: 'enum', values: [0, 1] },
      jam_mengajar: { type: 'string', optional: false },
      mengajar_hari_libur: { type: 'enum', values: [0, 1] },
      bagi_hasil_50persen: { type: 'enum', values: [0, 1] },
    };

    const v = new Validator();
    const validation = v.compile(schema);

    const validationResult = validation(req.body);
    console.log('debbug');
    console.log(validationResult);

    if (validationResult !== true) {
      return false;
    }

    return true;
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

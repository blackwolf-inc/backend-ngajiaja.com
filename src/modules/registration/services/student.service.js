const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const SendEmailNotification = require('../../../utils/nodemailer');
const { User, Peserta } = require('../../../models');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs/promises');

class StudentService extends BaseService {
  async checkUserId(req) {
    const data = await User.findOne({ where: { id: req.body.user_id } });
    if (!data) {
      throw ApiError.badRequest(`user not found`);
    }
    return data;
  }

  async getStudentByUserId(req) {
    const result = await User.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'nama', 'email', 'telp_wa', 'jenis_kelamin', 'alamat', 'tgl_lahir'],
      include: [
        {
          model: Peserta,
          as: 'peserta',
          attributes: [
            ['id', 'peserta_id'],
            'profesi',
            'level',
            'menguasai_ilmu_tajwid',
            'paham_aplikasi_meet',
            'siap_komitmen_mengaji',
            'siap_komitmen_infak',
            'bersedia_bayar_20K',
          ],
        },
      ],
    });
    if (!result) throw ApiError.notFound(`Peserta with id ${req.params.id} not found`);

    return result;
  }

  async updateStudentByUserId(req) {
    const result = await Peserta.update(req.body, { where: { user_id: req.params.id } });
    if (result > 0) {
      return result;
    } else {
      throw new Error(`Failed update ${this.db.name}`);
    }
  }

  async deleteStudentByUserId(req) {
    const result = await Peserta.destroy({ where: { user_id: req.params.id } });
    if (result > 0) {
      return result;
    } else {
      throw new Error(`Failed delete ${this.db.name}`);
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

  async createJadwalBimbingan(req) {
    const data = await this.__findOne({ where: { peserta_id: req.body.peserta_id } });
    if (data) {
      const result = await this.updateData(req.body, { id: data.id });
      return result;
    } else {
      const result = await this.createData(req.body);
      return result;
    }
  }

  async getOneJadwalBimbingan(req) {
    const data = await Peserta.findOne({ where: { user_id: req.user.id } });
    if (!data) {
      throw ApiError.badRequest(`Peserta not found`);
    }
    const result = await this.__findOne({ where: { peserta_id: data.id } });
    return result;
  }

  async sendNotificationEmail(email, name) {
    const getHtml = await SendEmailNotification.getHtml('notifikasiPeserta.ejs', { name });
    return SendEmailNotification.sendMail(email, 'Register Peserta Notification', getHtml);
  }

  async getPesertaProfile(id) {
    const result = await this.__findOne({ where: id }, this.#includeQuery);
    if (!result) throw ApiError.notFound(`Peserta with id ${id} not found`);

    const profile_uri = result.user.profile_picture
      ? `${process.env.BASE_URL}/images/${result.user.profile_picture}`
      : null;

    return {
      name: result.user.nama,
      email: result.user.email,
      telp_wa: result.user.telp_wa,
      gender: result.user.jenis_kelamin,
      address: result.user.alamat,
      birthdate: result.user.tgl_lahir,
      profesion: result.profesi,
      profile_picture: profile_uri,
    };
  }

  async updatePesertaProfile(req, payload, id) {
    const peserta = await this.__findOne({ where: id }, this.#includeQuery);
    if (!peserta) throw ApiError.notFound(`Peserta with id ${id} not found`);

    if (req.file) {
      payload.profile_picture = req.file.filename;
      await fs.unlink(path.join(process.cwd(), '../images', peserta.user.profile_picture));
    }

    await User.update(payload, { where: { id: peserta.user.id } });
    await Peserta.update(payload, { where: { id } });

    const result = await this.__findOne({ where: id }, this.#includeQuery);

    const profile_uri = result.user.profile_picture
      ? `${process.env.BASE_URL}/images/${result.user.profile_picture}`
      : null;

    return {
      name: result.user.nama,
      email: result.user.email,
      telp_wa: result.user.telp_wa,
      gender: result.user.jenis_kelamin,
      address: result.user.alamat,
      birthdate: result.user.tgl_lahir,
      profesion: result.profesi,
      profile_picture: profile_uri,
    };
  }

  #includeQuery = [
    {
      model: User,
      as: 'user',
      attributesL: {
        exclude: ['password', 'token'],
      },
    },
  ];
}

module.exports = StudentService;

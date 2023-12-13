const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const SendEmailNotification = require('../../../utils/nodemailer');
const moment = require('moment');
const { User, Pengajar } = require('../../../models');
const { STATUS_USER, USER_ROLE } = require('../../../helpers/constanta');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

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

      const dateParts = dateString.split('-');

      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const year = parseInt(dateParts[2], 10);
      const dateObject = new Date(year, month, day);
      const dateOnly = new Date(
        dateObject.getFullYear(),
        dateObject.getMonth(),
        dateObject.getDate(),
      );
      payload.tanggal_wawancara = dateOnly;
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
    const result = await User.findOne({
      where: { id: id },
      attributes: ['id', 'nama', 'email', 'telp_wa', 'jenis_kelamin', 'alamat', 'tgl_lahir'],
      include: [
        {
          model: Pengajar,
          as: 'pengajar',
          attributes: [
            ['id', 'pengajar_id'],
            'level',
            'pendidikan_terakhir',
            'punya_sertifikasi_guru_quran',
            'pengalaman_mengajar',
            'pernah_mengajar_online',
            'paham_aplikasi_meet',
            'siap_komitmen',
            'mengajar_hari_libur',
            'bagi_hasil_50persen',
            'isVerifiedByAdmin',
            'link_video_membaca_quran',
            'link_video_simulasi_mengajar',
            'tanggal_wawancara',
            'jam_wawancara',
            'nama_bank',
            'no_rekening',
            'link_wawancara',
          ],
        },
      ],
    });
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

  async updateStatusUserWhenInterviewSet(user_id) {
    const result = await User.update({ status: STATUS_USER.WAITING }, { where: { id: user_id } });

    return result;
  }

  async getPengajarProfile(id) {
    const result = await this.__findOne({ where: id }, this.#includeQuery);
    if (!result) throw ApiError.notFound(`Pengajar with id ${id} not found`);

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
      last_education: result.pendidikan_terakhir,
      profile_picture: profile_uri,
      nama_bank: result.nama_bank,
      no_rekening: result.no_rekening,
      atas_nama: result.nama_rekening,
    };
  }

  async updatePengajarProfile(req, payload, id) {
    const pengajar = await this.__findOne({ where: id }, this.#includeQuery);
    if (!pengajar) throw ApiError.notFound(`Pengajar with id ${id} not found`);

    if (req.file) {
      payload.profile_picture = req.file.filename;
    }

    await User.update(payload, { where: { id: pengajar.user.id } });
    await Pengajar.update(payload, { where: { id } });

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
      last_education: result.pendidikan_terakhir,
      profile_picture: profile_uri,
    };
  }

  async getPengajarVerifed() {
    const result = await this.__findAll(
      { where: { role: USER_ROLE.PENGAJAR, status: STATUS_USER.ACTIVE }, limit: 4 },
      this.#includeQueryPengajarVerified,
      'createdAt',
      'DESC',
    );

    const datas = [];
    for (const data of result.datas) {
      datas.push({
        name: data.nama,
        last_education: data.pengajar.pendidikan_terakhir,
        experience: data.pengajar.pengalaman_mengajar,
        have_certificate: data.pengajar.punya_sertifikasi_guru_quran,
        profile_picture: `${process.env.BASE_URL}/images/${data.profile_picture}`,
      });
    }

    return datas;
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

  #includeQueryPengajarVerified = [
    {
      model: Pengajar,
      as: 'pengajar',
    },
  ];
}

module.exports = TeacherService;

const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize, Peserta } = db;
const BaseService = require('../../../../base/base.service');
const UserService = require('../../../registration/services/user.service');
const PengajarService = require('../../../registration/services/teacher.service');
const moment = require('moment');
const ApiError = require('../../../../helpers/errorHandler');
const SendEmailNotification = require('../../../../utils/nodemailer');

class AdminPengajarService {
  /**
   * Seharusnya ini ada di dashboard peserta saat milih pengajar nya.
   */
  async pilihPengajarOlehPeserta(hariBimbingan1, jamBimbingan1, hariBimbingan2, jamBimbingan2) {
    const mulaiMengajar1 = jamBimbingan1.slice(0, 5);
    const mulaiMengajar2 = jamBimbingan2.slice(0, 5);

    /**
     * Hasil nya hanya bisa didapat jika kedua schedule terpenuhi.
     * Jika hanya satu schedule saja maka tidak akan muncul.
     */
    const resultJadwal = await Promise.all([
      sequelize.query(
        `
        SELECT 
          p.id AS 'pengajar_id', 
          u.id AS 'user_id', u.nama AS 'nama_pengajar', u.status, u.role
          -- jmp.hari_mengajar, jmp.mulai_mengajar, jmp.selesai_mengajar 
        FROM JadwalMengajarPengajars jmp 
        JOIN Pengajars p ON jmp.pengajar_id = p.id 
        JOIN Users u ON p.user_id = u.id 
        WHERE 
          u.role = 'PENGAJAR' AND
          (jmp.hari_mengajar = '${hariBimbingan1}' AND jmp.mulai_mengajar = '${mulaiMengajar1}') OR 
          (jmp.hari_mengajar = '${hariBimbingan2}' AND jmp.mulai_mengajar = '${mulaiMengajar2}')
        GROUP BY p.id 
        HAVING COUNT(p.id) > 1
        ORDER BY u.nama, jmp.mulai_mengajar
        `,
        { type: QueryTypes.SELECT }
      ),
    ]);

    return resultJadwal;
  }

  async getDataPengajar() {
    const [total_registered, total_active, total_nonactive, all_pengajars] = await Promise.all([
      sequelize.query(
        `
        SELECT COUNT(*) AS 'total'
        FROM Pengajars p 
        JOIN Users u ON p.user_id = u.id 
        WHERE u.role = 'PENGAJAR' AND u.status = 'REGISTERED'
        `,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `
        SELECT COUNT(*) AS 'total'
        FROM Pengajars p 
        JOIN Users u ON p.user_id = u.id 
        WHERE u.role = 'PENGAJAR' AND u.status = 'ACTIVE'
        `,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `
        SELECT COUNT(*) AS 'total'
        FROM Pengajars p 
        JOIN Users u ON p.user_id = u.id 
        WHERE u.role = 'PENGAJAR' AND u.status = 'NONACTIVE'
        `,
        { type: QueryTypes.SELECT }
      ),
      sequelize.query(
        `
        SELECT
          u.id AS 'user_id', u.nama, u.role, u.status,
          p.id AS 'Pengajar_id', p.tanggal_wawancara, p.jam_wawancara, p.link_wawancara 
        FROM Pengajars p 
        JOIN Users u ON p.user_id = u.id 
        WHERE u.role = 'PENGAJAR'
        `,
        { type: QueryTypes.SELECT }
      ),
    ]);

    return {
      total_registered: total_registered[0].total,
      total_active: total_active[0].total,
      total_nonactive: total_nonactive[0].total,
      all_pengajars,
    };
  }

  async updateJadwalWawancara(req, payload, userId) {
    const serviceUser = new UserService(req, User);
    const servicePengajar = new PengajarService(req, Pengajar);

    const [user, afterUpdateUser] = await Promise.all([
      serviceUser.getOneUser(userId),
      serviceUser.updateUserData({ status: payload.status_pengajar }, { id: userId }),
    ]);

    const afterUpdateJadwal = await servicePengajar.updateData(
      {
        link_wawancara: payload.link_wawancara,
        tanggal_wawancara: payload.tanggal_wawancara,
        jam_wawancara: payload.jam_wawancara,
        isVerifiedByAdmin: payload.isVerifiedByAdmin,
        level: payload.level_pengajar,
      },
      { id: user.pengajar.id }
    );

    return {
      status: afterUpdateUser.status,
      link_wawancara: afterUpdateJadwal.link_wawancara,
      tanggal_wawancara: afterUpdateJadwal.tanggal_wawancara,
      jam_wawancara: afterUpdateJadwal.jam_wawancara,
      isVerifiedByAdmin: afterUpdateJadwal.isVerifiedByAdmin,
      level: afterUpdateJadwal.level,
    };
  }

  async updateStatusPengajar(req, payload, userId) {
    const serviceUser = new UserService(req, User);
    const servicePengajar = new PengajarService(req, Pengajar);

    const [user, afterUpdateUser] = await Promise.all([
      serviceUser.getOneUser(userId),
      serviceUser.updateUserData({ status: payload.status_pengajar }, { id: userId }),
    ]);

    const afterUpdatePengajar = await servicePengajar.updateData(
      {
        level: payload.level_pengajar,
        persentase_bagi_hasil: payload.persentase_bagi_hasil,
      },
      { id: user.pengajar.id }
    );

    return {
      status: afterUpdateUser.status,
      level: afterUpdatePengajar.level,
      persentase_bagi_hasil: afterUpdatePengajar.persentase_bagi_hasil,
    };
  }

  async getPesertaPengajarRegistered(query, status, keyword, startDate, endDate) {
    const { pageSize = 10 } = query;
    let page = query.page ? parseInt(query.page) : 1;
    const offset = (page - 1) * pageSize;

    let whereClause =
      "WHERE u.role = 'PENGAJAR' AND u.status IN ('REGISTERED', 'WAITING', 'INTERVIEWED', 'REJECTED')";
    if (status) {
      whereClause += ` AND u.status = '${status}'`;
    }
    if (keyword) {
      whereClause += ` AND u.nama LIKE '%${keyword}%'`;
    }
    if (startDate && endDate) {
      const startDateInit = moment(startDate).format('YYYY-MM-DD');
      const endDateInit = moment(endDate).format('YYYY-MM-DD');
      whereClause += ` AND p.tanggal_wawancara BETWEEN '${startDateInit}' AND '${endDateInit}'`;
    }

    const base_url = process.env.BASE_URL;

    const result = await sequelize.query(
      `
      SELECT 
        u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa, u.createdAt,
        CONCAT('${base_url}/images/', u.profile_picture) AS 'profile_picture',
        p.id AS 'pengajar_id', p.tanggal_wawancara, p.jam_wawancara, p.link_wawancara, p.link_video_membaca_quran, p.link_video_simulasi_mengajar
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
      ORDER BY u.createdAt DESC
      LIMIT ${pageSize} OFFSET ${offset}
      `,
      { type: QueryTypes.SELECT }
    );

    const totalCount = await sequelize.query(
      `
    SELECT COUNT(*) AS total
    FROM (
      SELECT 1
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
    ) AS subquery
    `,
      { type: QueryTypes.SELECT }
    );

    const totalPages = Math.ceil(totalCount[0].total / pageSize);

    return { result, page, totalPages };
  }

  async getPesertaPengajarVerified(query, status, keyword, level) {
    const { pageSize = 10 } = query;
    let page = query.page ? parseInt(query.page) : 1;
    const offset = (page - 1) * pageSize;
    const base_url = process.env.BASE_URL;

    let whereClause = "WHERE u.role = 'PENGAJAR' AND u.status IN ('ACTIVE', 'NONACTIVE')";
    if (status) {
      whereClause += ` AND u.status = '${status}'`;
    }
    if (keyword) {
      whereClause += ` AND u.nama LIKE '%${keyword}%'`;
    }
    if (level) {
      whereClause += ` AND p.level = '${level}'`;
    }

    const result = await sequelize.query(
      `
      SELECT 
        u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa, u.createdAt,
        CONCAT('${base_url}/images/', u.profile_picture) AS 'profile_picture',
        p.id AS 'pengajar_id', p.level, p.persentase_bagi_hasil
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
      ORDER BY u.createdAt DESC
      LIMIT ${pageSize} OFFSET ${offset}
      `,
      { type: QueryTypes.SELECT }
    );

    const totalCount = await sequelize.query(
      `
    SELECT COUNT(*) AS total
    FROM (
      SELECT 1
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
    ) AS subquery
    `,
      { type: QueryTypes.SELECT }
    );
    const totalPages = Math.ceil(totalCount[0].total / pageSize);
    return { result, page, totalPages };
  }

  async getPengajarRegisteredExport(startDate, endDate) {
    let whereClause =
      "WHERE u.role = 'PENGAJAR' AND u.status IN ('REGISTERED', 'WAITING', 'INTERVIEWED', 'REJECTED')";

    if (startDate && endDate) {
      const startDateInit = moment(startDate).startOf('day').format('YYYY-MM-DD');
      const endDateInit = moment(endDate).endOf('day').format('YYYY-MM-DD');
      whereClause += ` AND p.createdAt BETWEEN '${startDateInit}' AND '${endDateInit}'`;
    }

    const base_url = process.env.BASE_URL;

    const result = await sequelize.query(
      `
      SELECT 
        u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa, u.createdAt,
        CONCAT('${base_url}/images/', u.profile_picture) AS 'profile_picture',
        p.id AS 'pengajar_id', p.tanggal_wawancara, p.jam_wawancara, p.link_wawancara, p.link_video_membaca_quran, p.link_video_simulasi_mengajar, p.createdAt
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
      ORDER BY u.createdAt DESC
      `,
      { type: QueryTypes.SELECT }
    );

    return result;
  }

  async getPengajarVerifiedExport(startDate, endDate) {
    let whereClause = "WHERE u.role = 'PENGAJAR' AND u.status IN ('ACTIVE', 'NONACTIVE')";

    if (startDate && endDate) {
      const startDateInit = moment(startDate).startOf('day').format('YYYY-MM-DD');
      const endDateInit = moment(endDate).endOf('day').format('YYYY-MM-DD');
      whereClause += ` AND p.createdAt BETWEEN '${startDateInit}' AND '${endDateInit}'`;
    }

    const base_url = process.env.BASE_URL;

    const result = await sequelize.query(
      `
      SELECT 
           u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa, u.createdAt,
           CONCAT('${base_url}/images/', u.profile_picture) AS 'profile_picture',
           p.id AS 'pengajar_id', p.level, p.createdAt
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
      ORDER BY u.createdAt DESC
      `,
      { type: QueryTypes.SELECT }
    );

    return result;
  }

  async getOneUser(paramId) {
    const data = User.findOne({ where: { id: paramId } });
    if (!data) {
      throw ApiError.badRequest(`${this.db.name} not found`);
    }

    return data;
  }

  async sendNotificationEmail(email, name) {
    const getHtml = await SendEmailNotification.getHtml('notifikasiPengajar.ejs', {
      email,
      name,
    });
    return SendEmailNotification.sendMail(email, 'Register Pengajar Notification', getHtml);
  }

  #includeQuery = [
    {
      model: Pengajar,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'pengajar',
    },
    {
      model: Peserta,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'peserta',
    },
  ];
}

module.exports = AdminPengajarService;

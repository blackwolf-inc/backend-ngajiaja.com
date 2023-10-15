const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;
const BaseService = require('./../../../../base/base.service');
const UserService = require('./../../../registration/services/user.service');

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

  async updateJadwalWawancara(req, link_wawancara, pengajarId) {
    const serviceUser = new UserService(req, Pengajar);
    const afterUpdateDate = await serviceUser.updateData({ link_wawancara }, { id: pengajarId });
    return afterUpdateDate;
  }
}

module.exports = AdminPengajarService;

const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, sequelize } = db;

class DataPengajarService {
  async dataPengajarAll(hariBimbingan1, jamBimbingan1, hariBimbingan2, jamBimbingan2) {
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
}

module.exports = new DataPengajarService();

const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;
const BaseService = require('../../../../base/base.service');
const UserService = require('../../../registration/services/user.service');
const PengajarService = require('../../../registration/services/teacher.service');
const moment = require('moment');

class AdminPesertaService {
    async getDataPeserta() {
        const [peserta_active, peserta_nonactive, total_peserta, all_peserta] = await Promise.all([
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Pesertas p 
                JOIN Users u ON p.user_id = u.id 
                WHERE u.role = 'PESERTA' AND u.status = 'ACTIVE'
                `,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Pesertas p 
                JOIN Users u ON p.user_id = u.id 
                WHERE u.role = 'PESERTA' AND u.status = 'NONACTIVE'
                `,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Pesertas p 
                JOIN Users u ON p.user_id = u.id 
                WHERE u.role = 'PESERTA'
                `,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `
                SELECT
                    u.id AS 'user_id', u.nama, u.role, u.status, u.email,
                    p.id AS 'peserta_id', p.level, p.profesi
                FROM Pesertas p 
                JOIN Users u ON p.user_id = u.id 
                WHERE u.role = 'PESERTA'
                `,
                { type: QueryTypes.SELECT }
            ),
        ]);

        return {
            total_peserta: total_peserta[0].total,
            peserta_active: peserta_active[0].total,
            peserta_nonactive: peserta_nonactive[0].total,
            all_peserta
        };
    }
}

module.exports = AdminPesertaService;
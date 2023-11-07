const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Peserta, User, sequelize } = db;
const BaseService = require('../../../../base/base.service');
const UserService = require('../../../registration/services/user.service');
const PesertaService = require('../../../registration/services/student.service');
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

    async getPesertaRegistered(query, status, keyword, startDate, endDate, bankName) {
        const { page = 1, pageSize = 10 } = query;
        const offset = (page - 1) * pageSize;

        let whereClause = "WHERE u.role = 'PESERTA' AND u.status IN ('REGISTERED', 'REJECTED', 'ADMINISTRATION')";
        if (status) {
            whereClause += ` AND u.status = '${status}'`;
        }
        if (keyword) {
            whereClause += ` AND u.nama LIKE '%${keyword}%'`;
        }
        if (startDate && endDate) {
            whereClause += ` AND DATE(b.createdAt) BETWEEN '${startDate}' AND '${endDate}'`;
        }
        if (bankName) {
            whereClause += ` AND bk.nama_bank = '${bankName}'`;
        }


        const result = await sequelize.query(
            `
          SELECT 
            u.id AS 'user_id', u.nama, u.role, u.status,
            p.id AS 'peserta_id', 
            b.bank_id, b.bukti_pembayaran, b.createdAt,
            bk.nama_bank
            FROM Pesertas p 
          JOIN Users u ON p.user_id = u.id 
          LEFT JOIN BiayaAdministrasis b ON p.user_id = b.user_id
          LEFT JOIN Banks bk ON b.bank_id = bk.id
          ${whereClause}
          LIMIT ${pageSize} OFFSET ${offset}
          `,
            { type: QueryTypes.SELECT }
        );

        return result;
    }

    async updateStatusPeserta(req, payload, userId) {
        const serviceUser = new UserService(req, User);
        const servicePeserta = new PesertaService(req, Peserta);

        const [user, afterUpdateUser] = await Promise.all([
            serviceUser.getOneUser(userId),
            serviceUser.updateUserData({ status: payload.status_peserta }, { id: userId }),
        ]);

        const afterUpdatePeserta = await servicePeserta.updateData(
            {
                level: payload.level_Peserta,
            },
            { id: user.peserta.id }
        );

        return {
            status: afterUpdateUser.status,
            level: afterUpdatePeserta.level,
        };
    }
}

module.exports = AdminPesertaService;
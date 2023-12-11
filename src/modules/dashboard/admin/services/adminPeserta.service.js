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
        const { pageSize = 10 } = query;
        let page = query.page ? parseInt(query.page) : 1;
        const offset = (page - 1) * pageSize;
        const base_url = process.env.BASE_URL;

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
            p.id AS 'peserta_id', p.level,
            b.bank_id, CONCAT('${base_url}/images/', b.bukti_pembayaran) AS bukti_pembayaran, b.createdAt,
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

        const totalCount = await sequelize.query(
            `
          SELECT COUNT(*) AS total
          FROM Pesertas p 
          JOIN Users u ON p.user_id = u.id 
          LEFT JOIN BiayaAdministrasis b ON p.user_id = b.user_id
          LEFT JOIN Banks bk ON b.bank_id = bk.id
          ${whereClause}
          `,
            { type: QueryTypes.SELECT }
        );

        const totalPages = Math.ceil(totalCount[0].total / pageSize);

        return { result, page, totalPages };
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
                level: payload.level_peserta,
            },
            { id: user.peserta.id }
        );

        return {
            status: afterUpdateUser.status,
            level: afterUpdatePeserta.level,
        };
    }

    async getPesertaVerified(query, status, keyword, level) {
        const { pageSize = 10 } = query;
        let page = query.page ? parseInt(query.page) : 1;
        const offset = (page - 1) * pageSize;

        let whereClause = "WHERE u.role = 'PESERTA' AND u.status IN ('ACTIVE', 'NONACTIVE')";
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
            u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa,
            p.id AS 'peserta_id', p.level,
            pr.id AS 'period_id', pr.status AS 'period_status',
            SUM(CASE WHEN br.absensi_peserta = 0 THEN 1 ELSE 0 END) AS notAttend
            FROM Pesertas p 
          JOIN Users u ON p.user_id = u.id 
          LEFT JOIN Periods pr ON p.id = pr.peserta_id
          LEFT JOIN BimbinganRegulers br ON pr.id = br.period_id
          ${whereClause}
          GROUP BY u.id, p.id, pr.id
          LIMIT ${pageSize} OFFSET ${offset}
          `,
            { type: QueryTypes.SELECT }
        );

        const totalCount = await sequelize.query(
            `
          SELECT COUNT(*) AS total
          FROM (
            SELECT 1
            FROM Pesertas p 
            JOIN Users u ON p.user_id = u.id 
            LEFT JOIN Periods pr ON p.id = pr.peserta_id
            LEFT JOIN BimbinganRegulers br ON pr.id = br.period_id
            ${whereClause}
            GROUP BY u.id, p.id, pr.id
          ) AS subquery
          `,
            { type: QueryTypes.SELECT }
        );

        const totalPages = Math.ceil(totalCount[0].total / pageSize);

        return { result, page, totalPages };
    }

    async updateStatusPesertaVerified(req, payload, userId) {
        const serviceUser = new UserService(req, User);
        const servicePeserta = new PesertaService(req, Peserta);

        const [user, afterUpdateUser] = await Promise.all([
            serviceUser.getOneUser(userId),
            serviceUser.updateUserData({ status: payload.status_peserta }, { id: userId }),
        ]);

        const afterUpdatePeserta = await servicePeserta.updateData(
            {
                level: payload.level_peserta,
            },
            { id: user.peserta.id }
        );

        return {
            status: afterUpdateUser.status,
            level: afterUpdatePeserta.level,
        };
    }

    async getPesertaRegisteredExport(startDate, endDate) {
        let whereClause = "WHERE u.role = 'PESERTA' AND u.status IN ('REGISTERED', 'REJECTED', 'ADMINISTRATION')";
        if (startDate && endDate) {
            const startDateInit = moment(startDate).startOf('day').format('YYYY-MM-DD');
            const endDateInit = moment(endDate).endOf('day').format('YYYY-MM-DD');
            whereClause += ` AND DATE(b.createdAt) BETWEEN '${startDateInit}' AND '${endDateInit}'`;
        }

        const result = await sequelize.query(
            `
          SELECT 
            u.id AS 'user_id', u.nama, u.role, u.status,
            p.id AS 'peserta_id', p.level,
            b.bank_id, b.bukti_pembayaran, b.createdAt,
            bk.nama_bank
            FROM Pesertas p 
          JOIN Users u ON p.user_id = u.id 
          LEFT JOIN BiayaAdministrasis b ON p.user_id = b.user_id
          LEFT JOIN Banks bk ON b.bank_id = bk.id
          ${whereClause}
          `,
            { type: QueryTypes.SELECT }
        );

        return result;
    }

    async getPesertaVerifiedExport(startDate, endDate) {
        let whereClause = "WHERE u.role = 'PESERTA' AND u.status IN ('ACTIVE', 'NONACTIVE')";
        if (startDate && endDate) {
            const startDateInit = moment(startDate).startOf('day').format('YYYY-MM-DD');
            const endDateInit = moment(endDate).endOf('day').format('YYYY-MM-DD');
            whereClause += ` AND DATE(pr.createdAt) BETWEEN '${startDateInit}' AND '${endDateInit}'`;
        }

        const result = await sequelize.query(
            `
          SELECT 
            u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa,
            p.id AS 'peserta_id', p.level,
            pr.id AS 'period_id', pr.status AS 'period_status', pr.createdAt as 'period_createAt',
            SUM(CASE WHEN br.absensi_peserta = 0 THEN 1 ELSE 0 END) AS notAttend
            FROM Pesertas p 
          JOIN Users u ON p.user_id = u.id 
          LEFT JOIN Periods pr ON p.id = pr.peserta_id
          LEFT JOIN BimbinganRegulers br ON pr.id = br.period_id
          ${whereClause}
          GROUP BY u.id, p.id, pr.id
          `,
            { type: QueryTypes.SELECT }
        );

        return result;
    }
}

module.exports = AdminPesertaService;
const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;
const BaseService = require('../../../../base/base.service');
const UserService = require('../../../registration/services/user.service');
const PengajarService = require('../../../registration/services/teacher.service');
const moment = require('moment');

class SuperAdminDashboardPengajar {
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

        const result = await sequelize.query(
            `
          SELECT 
            u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa,
            p.id AS 'pengajar_id', p.tanggal_wawancara, p.jam_wawancara, p.link_wawancara, p.link_video_membaca_quran, p.link_video_simulasi_mengajar
          FROM Pengajars p 
          JOIN Users u ON p.user_id = u.id 
          ${whereClause}
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

    async updatePengajarRegistered(req, payload, userId) {
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

    async getPengajarVerified(query, status, keyword, level) {
        const { pageSize = 10 } = query;
        let page = query.page ? parseInt(query.page) : 1;
        const offset = (page - 1) * pageSize;

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
        u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa,
        p.id AS 'pengajar_id', p.level, p.persentase_bagi_hasil
      FROM Pengajars p 
      JOIN Users u ON p.user_id = u.id 
      ${whereClause}
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

    async updatePengajarVerified(req, payload, userId) {
        const serviceUser = new UserService(req, User);
        const servicePengajar = new PengajarService(req, Pengajar);

        const [user, afterUpdateUser] = await Promise.all([
            serviceUser.getOneUser(userId),
            serviceUser.updateUserData({ status: payload.status_pengajar }, { id: userId }),
        ]);

        const afterUpdatePengajar = await servicePengajar.updateData(
            {
                level: payload.level,
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

    async getPengajarRegisteredExport(startDate, endDate) {
        let whereClause =
            "WHERE u.role = 'PENGAJAR' AND u.status IN ('REGISTERED', 'WAITING', 'INTERVIEWED', 'REJECTED')";

        if (startDate && endDate) {
            const startDateInit = moment(startDate).startOf('day').format('YYYY-MM-DD');
            const endDateInit = moment(endDate).endOf('day').format('YYYY-MM-DD');
            whereClause += ` AND p.createdAt BETWEEN '${startDateInit}' AND '${endDateInit}'`;
        }

        const result = await sequelize.query(
            `
        SELECT 
          u.id AS 'user_id', u.nama, u.role, u.status, u.telp_wa,
          p.id AS 'pengajar_id', p.tanggal_wawancara, p.jam_wawancara, p.link_wawancara, p.link_video_membaca_quran, p.link_video_simulasi_mengajar, p.createdAt
        FROM Pengajars p 
        JOIN Users u ON p.user_id = u.id 
        ${whereClause}
        `,
            { type: QueryTypes.SELECT }
        );

        return result;
    }
}

module.exports = SuperAdminDashboardPengajar;
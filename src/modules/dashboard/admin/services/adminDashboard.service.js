const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;

class AdminDashboard {
    async getDataAdminDashboard() {
        const [total_pengajar, total_peserta, total_bimbingan] = await Promise.all([
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
                FROM Pesertas p 
                JOIN Users u ON p.user_id = u.id 
                WHERE u.role = 'PESERTA' AND u.status = 'ACTIVE'
                `,
                { type: QueryTypes.SELECT }
            ),
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Periods 
                WHERE status IN ('ACTIVATED', 'FINISHED')
                `,
                { type: QueryTypes.SELECT }
            ),
        ]);

        return {
            total_pengajar: total_pengajar[0].total,
            total_peserta: total_peserta[0].total,
            total_bimbingan: total_bimbingan[0].total,
        };
    }

    async getAllBimbingan(month, startDate = '2023-01-01', endDate = '2023-12-31') {
        if (month) {
            const formattedMonth = month;
            const bimbinganReguler = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DATE(tanggal) AS day
                FROM BimbinganRegulers
                JOIN Periods ON BimbinganRegulers.period_id = Periods.id
                WHERE tanggal BETWEEN :startDate AND :endDate AND DATE_FORMAT(tanggal, '%Y-%m') = :formattedMonth AND Periods.status IN ('ACTIVATED', 'FINISHED')
                GROUP BY DATE(tanggal)
                `,
                {
                    replacements: { startDate, endDate, formattedMonth },
                    type: QueryTypes.SELECT
                }
            );

            const bimbinganTambahan = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DATE(tanggal) AS day
                FROM BimbinganTambahans
                JOIN Periods ON BimbinganTambahans.period_id = Periods.id
                WHERE tanggal BETWEEN :startDate AND :endDate AND DATE_FORMAT(tanggal, '%Y-%m') = :formattedMonth AND Periods.status IN ('ACTIVATED', 'FINISHED')
                GROUP BY DATE(tanggal)
                `,
                {
                    replacements: { startDate, endDate, formattedMonth },
                    type: QueryTypes.SELECT
                }
            );

            const result = {};

            for (const item of bimbinganReguler) {
                result[item.day] = (result[item.day] || 0) + item.total;
            }

            for (const item of bimbinganTambahan) {
                result[item.day] = (result[item.day] || 0) + item.total;
            }

            return result;
        } else {
            const bimbinganReguler = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DATE_FORMAT(tanggal, '%Y-%m') AS month
                FROM BimbinganRegulers
                JOIN Periods ON BimbinganRegulers.period_id = Periods.id
                WHERE tanggal BETWEEN :startDate AND :endDate AND Periods.status IN ('ACTIVATED', 'FINISHED')
                GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
                `,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT
                }
            );

            const bimbinganTambahan = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DATE_FORMAT(tanggal, '%Y-%m') AS month
                FROM BimbinganTambahans
                JOIN Periods ON BimbinganTambahans.period_id = Periods.id
                WHERE tanggal BETWEEN :startDate AND :endDate AND Periods.status IN ('ACTIVATED', 'FINISHED')
                GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
                `,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT
                }
            );

            const result = {};

            const allBimbingan = [...bimbinganReguler, ...bimbinganTambahan];


            for (const item of allBimbingan) {
                result[item.month] = (result[item.month] || 0) + item.total;
            }

            return result;
        }
    }

}
module.exports = AdminDashboard;
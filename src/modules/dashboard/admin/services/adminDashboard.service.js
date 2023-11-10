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

    async getAllBimbingan(month) {
        const monthMapping = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
        month = monthMapping[month];

        if (month) {
            const bimbinganReguler = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DAY(tanggal) AS day
                FROM BimbinganRegulers
                WHERE MONTH(tanggal) = ${month}
                GROUP BY DAY(tanggal)
                `,
                { type: QueryTypes.SELECT }
            );

            const bimbinganTambahan = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DAY(tanggal) AS day
                FROM BimbinganTambahans
                WHERE MONTH(tanggal) = ${month}
                GROUP BY DAY(tanggal)
                `,
                { type: QueryTypes.SELECT }
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
                SELECT COUNT(*) AS total, MONTH(tanggal) AS month
                FROM BimbinganRegulers
                GROUP BY MONTH(tanggal)
                `,
                { type: QueryTypes.SELECT }
            );

            const bimbinganTambahan = await sequelize.query(
                `
                SELECT COUNT(*) AS total, MONTH(tanggal) AS month
                FROM BimbinganTambahans
                GROUP BY MONTH(tanggal)
                `,
                { type: QueryTypes.SELECT }
            );

            const result = {};
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            const allBimbingan = [...bimbinganReguler, ...bimbinganTambahan];

            for (const item of allBimbingan) {
                const month = months[item.month - 1];
                result[month] = (result[month] || 0) + item.total;
            }

            return result;
        }
    }

}
module.exports = AdminDashboard;
const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;

class SuperAdminDashboard {
    async getDataMonthSuperAdminDashboard(month, year = 2023) {
        const monthMapping = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
        month = monthMapping[month];

        if (month) {
            const bimbinganReguler = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DAY(tanggal) AS day
                FROM BimbinganRegulers
                WHERE YEAR(tanggal) = ${year} AND MONTH(tanggal) = ${month}
                GROUP BY DAY(tanggal)
                `,
                { type: QueryTypes.SELECT }
            );

            const bimbinganTambahan = await sequelize.query(
                `
                SELECT COUNT(*) AS total, DAY(tanggal) AS day
                FROM BimbinganTambahans
                WHERE YEAR(tanggal) = ${year} AND MONTH(tanggal) = ${month}
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
                WHERE YEAR(tanggal) = ${year}
                GROUP BY MONTH(tanggal)
                `,
                { type: QueryTypes.SELECT }
            );

            const bimbinganTambahan = await sequelize.query(
                `
                SELECT COUNT(*) AS total, MONTH(tanggal) AS month
                FROM BimbinganTambahans
                WHERE YEAR(tanggal) = ${year}
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

module.exports = SuperAdminDashboard;
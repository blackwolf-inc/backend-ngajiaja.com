const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;

class SuperAdminDashboard {
    async getDataMonthSuperAdminDashboard(month, startDate = '2023-01-01', endDate = '2023-12-31') {

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

    async getDataDashboard(startDate = '2023-01-01', endDate = '2023-12-31') {
        const [total_bimbingan, total_penghasilan, penghasilan_pengajar, penghasilan_perusahaan] = await Promise.all([
            sequelize.query(
                `
                SELECT COUNT(*) AS 'total'
                FROM Periods
                WHERE status IN ('ACTIVATED', 'FINISHED') AND updatedAt BETWEEN :startDate AND :endDate
                `,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT
                }
            ),
            sequelize.query(
                `
                SELECT SUM(pembayaran) AS 'total'
                FROM PenghasilanPengajars
                WHERE waktu_pembayaran BETWEEN :startDate AND :endDate
                `,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT
                }
            ),
            sequelize.query(
                `
                SELECT SUM(penghasilan) AS 'total'
                FROM PenghasilanPengajars
                WHERE waktu_pembayaran BETWEEN :startDate AND :endDate
                `,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT
                }
            ),
            sequelize.query(
                `
                SELECT (SUM(pembayaran) - SUM(penghasilan)) AS 'total'
                FROM PenghasilanPengajars
                WHERE waktu_pembayaran BETWEEN :startDate AND :endDate
                `,
                {
                    replacements: { startDate, endDate },
                    type: QueryTypes.SELECT
                }
            ),
        ]);

        const penghasilan_pengajar_chart = (penghasilan_pengajar[0].total / total_penghasilan[0].total) * 100;
        const penghasilan_perusahaan_chart = (penghasilan_perusahaan[0].total / total_penghasilan[0].total) * 100;

        return {
            total_bimbingan: total_bimbingan[0].total,
            total_penghasilan: total_penghasilan[0].total,
            penghasilan_pengajar: penghasilan_pengajar[0].total,
            penghasilan_perusahaan: penghasilan_perusahaan[0].total,
            penghasilan_pengajar_chart: penghasilan_pengajar_chart,
            penghasilan_perusahaan_chart: penghasilan_perusahaan_chart,
        };
    }


}

module.exports = SuperAdminDashboard;
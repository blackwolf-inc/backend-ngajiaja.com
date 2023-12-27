const { QueryTypes, Op } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, Peserta, User, Infaq, Bank, sequelize } = db;

class SuperAdminDashboard {
    async getDataSuperAdminDashboard(granularity, startDate = '2023-01-01', endDate = '2024-12-31') {
        const dateGroupBy = granularity === 'yearly' ? '%Y' : granularity === 'monthly' ? '%Y-%m' : '%Y-%m-%d';
        const dateSelect = granularity === 'yearly' ? "DATE_FORMAT(tanggal, '%Y') AS year" : granularity === 'monthly' ? "DATE_FORMAT(tanggal, '%Y-%m') AS month" : "DATE_FORMAT(tanggal, '%Y-%m-%d') AS day";

        const allDates = [];
        for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const key = granularity === 'yearly' ? year : granularity === 'monthly' ? `${year}-${month}` : `${year}-${month}-${day}`;
            allDates[key] = 0;
        }

        const bimbinganReguler = await sequelize.query(
            `
            SELECT COUNT(*) AS total, ${dateSelect}
            FROM BimbinganRegulers
            JOIN Periods ON BimbinganRegulers.period_id = Periods.id
            WHERE tanggal BETWEEN :startDate AND :endDate AND Periods.status IN ('ACTIVATED', 'FINISHED')
            GROUP BY DATE_FORMAT(tanggal, :dateGroupBy)
            `,
            {
                replacements: { startDate, endDate, dateGroupBy },
                type: QueryTypes.SELECT
            }
        );

        const bimbinganTambahan = await sequelize.query(
            `
            SELECT COUNT(*) AS total, ${dateSelect}
            FROM BimbinganTambahans
            JOIN Periods ON BimbinganTambahans.period_id = Periods.id
            WHERE tanggal BETWEEN :startDate AND :endDate AND Periods.status IN ('ACTIVATED', 'FINISHED')
            GROUP BY DATE_FORMAT(tanggal, :dateGroupBy)
            `,
            {
                replacements: { startDate, endDate, dateGroupBy },
                type: QueryTypes.SELECT
            }
        );

        const result = { ...allDates };

        const allBimbingan = [...bimbinganReguler, ...bimbinganTambahan];

        for (const item of allBimbingan) {
            const key = granularity === 'yearly' ? item.year : granularity === 'monthly' ? item.month : item.day;
            result[key] = (result[key] || 0) + item.total;
        }

        return result;
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

    async getDataInfaqDashboard(status, nama_bank, startDate, endDate) {
        const infaqs = await Infaq.findAll({
            where: {
                status,
                waktu_pembayaran: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Bank,
                    as: 'bank',
                    where: { nama_bank },
                    attributes: ['nama_bank']
                }
            ],
            attributes: ['status', 'bank_id', 'nama_bank', 'nominal', 'waktu_pembayaran', 'bukti_pembayaran', 'keterangan']
        });

        return infaqs;
    }
}

module.exports = SuperAdminDashboard;
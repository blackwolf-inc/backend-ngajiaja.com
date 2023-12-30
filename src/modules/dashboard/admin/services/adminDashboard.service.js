const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, User, sequelize } = db;
const { getHash } = require('../../../../helpers/passwordHash');

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

    async getAllBimbingan(granularity, startDate = '2023-01-01', endDate = '2024-12-31') {
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

    async changeUserPasswordService(userId, password, retypePassword) {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        if (password !== retypePassword) {
            throw new Error('Password and retype password do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        if (password === user.password) {
            throw new Error('Password must be different from the previous one');
        }

        if (password) {
            password = getHash(password);
        }

        await user.update({ password });
    }

}
module.exports = AdminDashboard;
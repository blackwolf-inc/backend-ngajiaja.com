const { QueryTypes, Op } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, Peserta, User, Infaq, Pencairan, sequelize } = db;
const multer = require('multer');

class SuperAdminDataTransaksi {
    async getDataPencairan(query, startDate, endDate, status, keywordTeacher) {
        const { pageSize = 10 } = query;
        let page = query.page ? parseInt(query.page) : 1;
        const offset = (page - 1) * pageSize;

        let whereClause = '';

        if (startDate && endDate) {
            whereClause += `WHERE Pencairans.createdAt BETWEEN '${startDate}' AND '${endDate}'`;
        }

        if (status) {
            whereClause += whereClause ? ` AND Pencairans.status = '${status}'` : `WHERE Pencairans.status = '${status}'`;
        }

        if (keywordTeacher) {
            whereClause += whereClause ? ` AND Users.nama LIKE '%${keywordTeacher}%'` : `WHERE Users.nama LIKE '%${keywordTeacher}%'`;
        }

        const result = await sequelize.query(
            `
            SELECT Pencairans.id, Pencairans.user_id, Pencairans.status, Pencairans.nominal, Pencairans.waktu_pembayaran, Pencairans.bukti_pembayaran, Pencairans.pengajar_id, Pencairans.createdAt, Pencairans.updatedAt, Users.nama
            FROM Pencairans
            JOIN Users ON Pencairans.user_id = Users.id
            ${whereClause}
            LIMIT ${pageSize} OFFSET ${offset}
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        const totalCount = await sequelize.query(
            `
            SELECT COUNT(*) as total
            FROM Pencairans
            JOIN Users ON Pencairans.user_id = Users.id
            ${whereClause}
            `,
            {
                type: QueryTypes.SELECT,
            }
        );

        const totalPages = Math.ceil(totalCount[0].total / pageSize);

        return { result, page, totalPages };
    }

    async getDataPencairanById(id) {
        const pencairan = await sequelize.query(
            `
            SELECT Pencairans.id, Pencairans.user_id, Pencairans.status, Pencairans.nominal, Pencairans.waktu_pembayaran, Pencairans.bukti_pembayaran, Pencairans.pengajar_id, Pencairans.nama_bank, Pencairans.no_rekening, Pencairans.nama_rekening, Users.nama
            FROM Pencairans
            JOIN Users ON Pencairans.user_id = Users.id
            WHERE Pencairans.id = :id
            `,
            {
                replacements: {
                    id
                },
                type: QueryTypes.SELECT
            }
        );

        return pencairan;
    }

    async updateStatusPencairan(id, status, bukti_pembayaran, keterangan) {
        const pencairan = await Pencairan.findOne({
            where: {
                id
            }
        });

        if (!pencairan) {
            throw new Error('Pencairan tidak ditemukan');
        }

        pencairan.status = status;
        pencairan.bukti_pembayaran = bukti_pembayaran;
        pencairan.waktu_pembayaran = new Date();
        pencairan.keterangan = keterangan;

        await pencairan.save();

        return pencairan;
    }
}

module.exports = SuperAdminDataTransaksi;
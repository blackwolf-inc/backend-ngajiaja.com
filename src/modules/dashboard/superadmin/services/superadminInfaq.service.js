const { QueryTypes, Op } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, Peserta, User, Infaq, Bank, sequelize } = db;

class SuperAdminInfaq {
    async addInfaqSAdminService(data) {
        const {
            peserta_id,
            pengajar_id,
            bank_id,
            periode_id,
            status,
            nominal,
            waktu_pembayaran,
            bukti_pembayaran,
            keterangan
        } = data;


        const newInfaq = await Infaq.create({
            peserta_id,
            pengajar_id,
            bank_id,
            periode_id,
            status,
            nominal,
            waktu_pembayaran,
            bukti_pembayaran,
            keterangan
        });

        return newInfaq;
    }
}

module.exports = SuperAdminInfaq;
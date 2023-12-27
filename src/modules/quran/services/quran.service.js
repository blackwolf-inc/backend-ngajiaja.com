const db = require('../../.../../../models/index');
const { Quran, sequelize } = db;
const { QueryTypes } = require('sequelize');

class QuranService {
    async getQuranIndex() {
        const quranIndex = await sequelize.query(
            `
            SELECT no_surat, nama_surat, turun_di, arti_surat FROM QuranIndex
            `,
            { type: QueryTypes.SELECT }
        );

        return quranIndex;
    }

    async getQuranAyat(id) {
        const quranAyat = await sequelize.query(
            `
            SELECT QuranAyat.id_surat, QuranAyat.no_ayat, QuranAyat.ayat, QuranAyat.terjemahan, QuranAyat.keterangan, QuranIndex.nama_surat, QuranIndex.turun_di, QuranIndex.arti_surat 
            FROM QuranAyat
            INNER JOIN QuranIndex ON QuranAyat.id_surat = QuranIndex.id
            WHERE QuranAyat.id_surat = ${id}
            `,
            { type: QueryTypes.SELECT }
        );

        return quranAyat;
    }

    async getQuranAyatBySuratAndAyat(idSurat, noAyat) {
        const quranAyat = await sequelize.query(
            `
            SELECT QuranAyat.id_surat, QuranAyat.no_ayat, QuranAyat.ayat, QuranAyat.terjemahan, QuranAyat.keterangan, QuranIndex.nama_surat, QuranIndex.turun_di, QuranIndex.arti_surat 
            FROM QuranAyat
            INNER JOIN QuranIndex ON QuranAyat.id_surat = QuranIndex.id
            WHERE QuranAyat.id_surat = ${idSurat} AND QuranAyat.no_ayat = ${noAyat}
            `,
            { type: QueryTypes.SELECT }
        );

        return quranAyat;
    }

}

module.exports = QuranService;
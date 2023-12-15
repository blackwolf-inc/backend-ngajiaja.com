const QuranService = require('../services/quran.service');
const responseHandler = require('../../../helpers/responseHandler');

class QuranController {
    static async getQuranIndex(req, res, next) {
        const service = new QuranService();
        try {
            const quranIndex = await service.getQuranIndex();
            return responseHandler.succes(res, 'Quran Index', quranIndex);
        } catch (error) {
            next(error);
        }
    }

    static async getQuranAyat(req, res, next) {
        const service = new QuranService();
        try {
            const quranAyat = await service.getQuranAyat(req.params.id);
            return responseHandler.succes(res, 'Success get Quran Surat', quranAyat);
        } catch (error) {
            next(error);
        }
    }

    static async getQuranAyatBySuratAndAyat(req, res, next) {
        const service = new QuranService();
        try {
            const quranAyat = await service.getQuranAyatBySuratAndAyat(req.params.idSurat, req.params.noAyat);
            return responseHandler.succes(res, 'Success get Quran Ayat detail', quranAyat);
        } catch (error) {
            next(error);
        }
    }


}

module.exports = QuranController;
const SuperAdminDashboardService = require('../services/superadminDashboard.service.js')
const SuperAdminPesertaDashboardService = require('../services/superadminPesertaDashboard.service.js')
const responseHandler = require('../../../../helpers/responseHandler');

class SuperAdminController {
    static async getAllDataSuperAdminDashboard(req, res, next) {
        const service = new SuperAdminDashboardService();
        try {
            const { month, startDate, endDate } = req.query;
            const result = await service.getDataMonthSuperAdminDashboard(month, startDate, endDate);
            return responseHandler.succes(res, 'Success get all bimbingan', result);
        } catch (error) {
            next(error);
        }
    }

    static async getDataSuperAdminDashboard(req, res, next) {
        const service = new SuperAdminDashboardService();
        const { startDate, endDate } = req.query;
        try {
            const result = await service.getDataDashboard(startDate, endDate);
            return responseHandler.succes(res, 'Success get all data', result);
        } catch (error) {
            next(error);
        }
    }

    static async getDataInfaqAdmin(req, res, next) {
        const service = new SuperAdminDashboardService();
        const { nama, nama_bank, status, startDate, endDate } = req.query;
        try {
            const result = await service.getDataInfaqDashboard(nama, nama_bank, status, startDate, endDate);
            return responseHandler.succes(res, 'Success get all data', result);
        } catch (error) {
            next(error);
        }
    }

    static async getDataPeserta(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const result = await service.getDataPeserta();
            return responseHandler.succes(res, 'Success get all data', result);
        } catch (error) {
            next(error);
        }
    }

    static async getPesertaRegistered(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { query } = req;
            const { status, keyword, startDate, endDate, bankName } = query;
            const result = await service.getPesertaRegistered(
                query,
                status,
                keyword,
                startDate,
                endDate,
                bankName
            );
            return responseHandler.succes(res, 'Success get peserta Terdaftar', result);
        } catch (error) {
            next(error);
        }
    }

    static async updateStatusPeserta(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { userId } = req.params;
            const { status_peserta, level_peserta } = req.body;
            const result = await service.updateStatusPeserta(
                req,
                { status_peserta, level_peserta },
                userId
            );
            return responseHandler.succes(res, 'Success update status peserta', result);
        } catch (error) {
            next(error);
        }
    }

    static async getPesertaVerified(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { query } = req;
            const { status, keyword, level } = query;
            const result = await service.getPesertaVerified(query, status, keyword, level);
            return responseHandler.succes(res, 'Success get peserta Terverifikasi', result);
        } catch (error) {
            next(error);
        }
    }

    static async updateStatusPesertaVerified(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { userId } = req.params;
            const { status_peserta, level_peserta } = req.body;
            const result = await service.updateStatusPesertaVerified(
                req,
                { status_peserta, level_peserta },
                userId
            );
            return responseHandler.succes(res, 'Success update status peserta', result);
        } catch (error) {
            next(error);
        }
    }

    static async getDataPengajar(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const result = await service.getDataPengajar();
            return responseHandler.succes(res, 'Success get all data', result);
        } catch (error) {
            next(error);
        }
    }

    static async getPengajarRegistered(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { query } = req;
            const { status, keyword, startDate, endDate } = query;
            const result = await service.getPengajarRegistered(
                query,
                status,
                keyword,
                startDate,
                endDate
            );
            return responseHandler.succes(res, 'Success get pengajar Terdaftar', result);
        } catch (error) {
            next(error);
        }
    }

    static async updateStatusPengajarTerdaftar(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { userId } = req.params;
            const { link_wawancara, tanggal_wawancara, jam_wawancara, isVerifiedByAdmin, level_pengajar, status_pengajar } = req.body;
            const result = await service.updateStatusPengajarTerdaftar(
                req,
                { link_wawancara, tanggal_wawancara, jam_wawancara, isVerifiedByAdmin, level_pengajar, status_pengajar },
                userId
            );
            return responseHandler.succes(res, 'Success update status pengajar terdaftar', result);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = SuperAdminController
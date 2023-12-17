const SuperAdminDashboardService = require('../services/superadminDashboard.service.js')
const SuperAdminPesertaDashboardService = require('../services/superadminPesertaDashboard.service.js')
const SuperAdminPengajarDashboardService = require('../services/superadminPengajarDashboard.service.js')
const SuperAdminManageCourseService = require('../services/superadminKelolaBimbingan.service.js')
const SuperAdminDataTransaksi = require('../services/superadminDataTransaksi.service.js')
const responseHandler = require('../../../../helpers/responseHandler');
const Papa = require('papaparse');

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
        const service = new SuperAdminPengajarDashboardService();
        try {
            const result = await service.getDataPengajar();
            return responseHandler.succes(res, 'Success get all data', result);
        } catch (error) {
            next(error);
        }
    }

    static async getPengajarRegistered(req, res, next) {
        const service = new SuperAdminPengajarDashboardService();
        try {
            const { query } = req;
            const { status, keyword, startDate, endDate } = query;
            const result = await service.getPesertaPengajarRegistered(
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
        const service = new SuperAdminPengajarDashboardService();
        try {
            const { userId } = req.params;
            const { link_wawancara, tanggal_wawancara, jam_wawancara, isVerifiedByAdmin, level_pengajar, status_pengajar } = req.body;
            const result = await service.updatePengajarRegistered(
                req,
                { link_wawancara, tanggal_wawancara, jam_wawancara, isVerifiedByAdmin, level_pengajar, status_pengajar },
                userId
            );
            return responseHandler.succes(res, 'Success update status pengajar terdaftar', result);
        } catch (error) {
            next(error);
        }
    }

    static async getPengajarVerified(req, res, next) {
        const service = new SuperAdminPengajarDashboardService();
        try {
            const { query } = req;
            const { status, keyword, level } = query;
            const result = await service.getPengajarVerified(query, status, keyword, level);
            return responseHandler.succes(res, 'Success get pengajar Terverifikasi', result);
        } catch (error) {
            next(error);
        }
    }

    static async updateStatusPengajar(req, res, next) {
        const service = new SuperAdminPengajarDashboardService();
        try {
            const { userId } = req.params;
            const { status_pengajar, level_pengajar, persentase_bagi_hasil } = req.body;
            const result = await service.updateStatusPengajar(
                req,
                { status_pengajar, level_pengajar, persentase_bagi_hasil },
                userId
            );
            return responseHandler.succes(res, 'Success update status pengajar', result);
        } catch (error) {
            next(error);
        }
    }

    static async getPesertaRegisteredExport(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { query } = req;
            const { startDate, endDate } = query;
            const result = await service.getPesertaRegisteredExport(
                startDate,
                endDate
            );
            const csv = Papa.unparse(result);
            const date = +new Date();

            const filename = `PesertaRegistered_${date}.csv`;

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    static async getPesertaVerifiedExport(req, res, next) {
        const service = new SuperAdminPesertaDashboardService();
        try {
            const { query } = req;
            const { startDate, endDate } = query;
            const result = await service.getPesertaVerifiedExport(
                startDate,
                endDate
            );
            const csv = Papa.unparse(result);
            const date = +new Date();

            const filename = `PengajarRegistered_${date}.csv`;

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    static async getPengajarRegisteredExport(req, res, next) {
        const service = new SuperAdminPengajarDashboardService();
        try {
            const { query } = req;
            const { startDate, endDate } = query;
            const result = await service.getPengajarRegisteredExport(
                startDate,
                endDate
            );
            const csv = Papa.unparse(result);
            const date = +new Date();

            const filename = `PengajarRegistered_${date}.csv`;

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    static async getPengajarVerifiedExport(req, res, next) {
        const service = new SuperAdminPengajarDashboardService();
        try {
            const { query } = req;
            const { startDate, endDate } = query;
            const result = await service.getPengajarVerifiedExport(
                startDate,
                endDate
            );
            const csv = Papa.unparse(result);
            const date = +new Date();

            const filename = `PengajarVerified_${date}.csv`;

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            res.send(csv);
        } catch (error) {
            next(error);
        }
    }

    static async getAllCourse(req, res, next) {
        const service = new SuperAdminManageCourseService();
        try {
            const result = await service.getAllDataCourse();
            return responseHandler.succes(res, 'Success get all course', result);
        } catch (error) {
            next(error);
        }
    }

    static async getCourseOngoing(req, res, next) {
        const service = new SuperAdminManageCourseService();
        try {
            const { query } = req;
            const { keywordStudent, keywordTeacher } = query;
            const result = await service.getCourseOngoing(query, keywordStudent, keywordTeacher);
            return responseHandler.succes(res, 'Success get course ongoing', result);
        } catch (error) {
            next(error);
        }
    }

    static async getCourseFinished(req, res, next) {
        const service = new SuperAdminManageCourseService();
        try {
            const { query } = req;
            const { keywordStudent, keywordTeacher, startDate, endDate } = query;
            const result = await service.getCourseFinished(query, keywordStudent, keywordTeacher, startDate, endDate);
            return responseHandler.succes(res, 'Success get course finished', result);
        } catch (error) {
            next(error);
        }
    }

    static async getCourseOngoingById(req, res, next) {
        const service = new SuperAdminManageCourseService();
        try {
            const { courseId } = req.params;
            const result = await service.getCourseOngoingById(courseId);
            return responseHandler.succes(res, 'Success get course ongoing by id', result);
        } catch (error) {
            next(error);
        }
    }

    static async getCourseFinishedById(req, res, next) {
        const service = new SuperAdminManageCourseService();
        try {
            const { courseId } = req.params;
            const result = await service.getCourseFinishedById(courseId);
            return responseHandler.succes(res, 'Success get course finished by id', result);
        } catch (error) {
            next(error);
        }
    }

    static async getDataPencairan(req, res, next) {
        const service = new SuperAdminDataTransaksi();
        try {
            const { query } = req;
            const { startDate, endDate, status, keywordTeacher } = query;
            const result = await service.getDataPencairan(query, startDate, endDate, status, keywordTeacher);
            return responseHandler.succes(res, 'Success get data pencairan', result);
        } catch (error) {
            next(error);
        }
    }

    static async getDataPencairanById(req, res, next) {
        const service = new SuperAdminDataTransaksi();
        try {
            const { id } = req.params;
            const result = await service.getDataPencairanById(id);
            return responseHandler.succes(res, 'Success get data pencairan by id', result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SuperAdminController
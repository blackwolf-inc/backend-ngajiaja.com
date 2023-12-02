const AdminPengajarService = require('../services/adminPengajar.service.js');
const AdminPesertaService = require('../services/adminPeserta.service.js');
const AdminDashboard = require('../services/adminDashboard.service.js');
const AdminManageCourseService = require('../services/adminKelolaBimbingan.js');
const responseHandler = require('../../../../helpers/responseHandler');
const fs = require('fs');
const Papa = require('papaparse');

class AdminDashboardController {
  static async dataPengajar(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const result = await service.getDataPengajar();
      return responseHandler.succes(res, 'Success get data pengajar all', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateWawancara(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { userId } = req.params;
      const { link_wawancara, tanggal_wawancara, jam_wawancara, status_pengajar, isVerifiedByAdmin, level_pengajar } = req.body;
      const result = await service.updateJadwalWawancara(
        req,
        {
          link_wawancara,
          tanggal_wawancara,
          jam_wawancara,
          status_pengajar,
          isVerifiedByAdmin,
          level_pengajar
        },
        userId
      );
      return responseHandler.succes(res, 'Success update pengajar registered', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusPengajar(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { userId } = req.params;
      const { status_pengajar, level_pengajar } = req.body;
      const result = await service.updateStatusPengajar(
        req,
        { status_pengajar, level_pengajar },
        userId
      );
      return responseHandler.succes(res, 'Success update status pengajar', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPengajarRegistered(req, res, next) {
    const service = new AdminPengajarService();
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

  static async getPengajarVerified(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { query } = req;
      const { status, keyword, level } = query;
      let result = await service.getPesertaPengajarVerified(query, status, keyword, level);
      // result = result?.result?.map((item) => ({ ...item, bagi_hasil: 50 }));
      return responseHandler.succes(res, 'Success get pengajar Terverifikasi', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllDataPeserta(req, res, next) {
    const service = new AdminPesertaService();
    try {
      const result = await service.getDataPeserta();
      return responseHandler.succes(res, 'Success get all data peserta', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPesertaRegistered(req, res, next) {
    const service = new AdminPesertaService();
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
    const service = new AdminPesertaService();
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
    const service = new AdminPesertaService();
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
    const service = new AdminPesertaService();
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

  static async getDataDashboardAdmin(req, res, next) {
    const service = new AdminDashboard();
    try {
      const result = await service.getDataAdminDashboard();
      return responseHandler.succes(res, 'Success get data dashboard admin', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllBimbingan(req, res, next) {
    const service = new AdminDashboard();
    try {
      const { month } = req.query;
      const result = await service.getAllBimbingan(month);
      return responseHandler.succes(res, 'Success get all bimbingan', result);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCourse(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const result = await service.getAllDataCourse();
      return responseHandler.succes(res, 'Success get all course', result);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseOngoing(req, res, next) {
    const service = new AdminManageCourseService();
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
    const service = new AdminManageCourseService();
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
    const service = new AdminManageCourseService();
    try {
      const { periodId } = req.params;
      const result = await service.getCourseOngoingById(periodId);
      return responseHandler.succes(res, 'Success get course ongoing by id', result);
    } catch (error) {
      next(error);
    }
  }

  static async getCourseFinishedById(req, res, next) {
    const service = new AdminManageCourseService();
    try {
      const { periodId } = req.params;
      const result = await service.getCourseFinishedById(periodId);
      return responseHandler.succes(res, 'Success get course finished by id', result);
    } catch (error) {
      next(error);
    }
  }

  static async exportDataPengajarRegistered(req, res, next) {
    const service = new AdminPengajarService();
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

  static async exportDataPengajarVerified(req, res, next) {
    const service = new AdminPengajarService();
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

  static async exportDataPesertaRegistered(req, res, next) {
    const service = new AdminPesertaService();
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
}

module.exports = AdminDashboardController;

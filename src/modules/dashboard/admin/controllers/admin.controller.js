const AdminPengajarService = require('../services/adminPengajar.service.js');
const responseHandler = require('../../../../helpers/responseHandler');

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
      const { tanggal_wawancara, jam_wawancara, link_wawancara } = req.body;
      const result = await service.updateJadwalPengajarRegistered(
        req,
        { tanggal_wawancara, jam_wawancara, link_wawancara },
        userId
      );
      return responseHandler.succes(res, 'Success update jadwal wawancara pengajar', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusPengajar(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { userId } = req.params;
      const { status_pengajar, level_pengajar, bagi_hasil_50persen } = req.body;
      const result = await service.updateStatusPengajar(
        req,
        { status_pengajar, level_pengajar, bagi_hasil_50persen },
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
      const { status, keyword, dateRange } = query;
      const result = await service.getPesertaPengajarRegistered(query, status, keyword, dateRange);
      return responseHandler.succes(res, 'Success get pengajar Terdaftar', result);
    } catch (error) {
      next(error);
    }
  }

  static async getPengajarVerified(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { query } = req;
      const { status, keyword, level, bagiHasil } = query;
      const result = await service.getPesertaPengajarVerified(query, status, keyword, level, bagiHasil);
      return responseHandler.succes(res, 'Success get pengajar Terverifikasi', result);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = AdminDashboardController;

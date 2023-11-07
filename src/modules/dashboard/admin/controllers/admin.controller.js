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
      const { link_wawancara, tanggal_wawancara, jam_wawancara, status_pengajar } = req.body;
      const result = await service.updateJadwalWawancara(
        req,
        {
          link_wawancara,
          tanggal_wawancara,
          jam_wawancara,
          status_pengajar
        },
        userId);
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
      const result = await service.getPesertaPengajarRegistered(query, status, keyword, startDate, endDate);
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
      result = result.map(item => ({ ...item, bagi_hasil: 50 }));
      return responseHandler.succes(res, 'Success get pengajar Terverifikasi', result);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = AdminDashboardController;

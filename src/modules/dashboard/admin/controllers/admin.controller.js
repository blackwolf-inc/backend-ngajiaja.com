const AdminPengajarService = require('../services/adminPengajar.service');
const responseHandler = require('./../../../../helpers/responseHandler');

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
      const { link_wawancara } = req.body;
      const { userId } = req.params;
      const result = await service.updateJadwalWawancara(req, link_wawancara, userId);
      return responseHandler.succes(res, 'Success update link wawancara for pengajar', result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatusPengajar(req, res, next) {
    const service = new AdminPengajarService();
    try {
      const { status_pengajar, level_pengajar } = req.body;
      const { userId } = req.params;

      const result = await service.updateStatusPengajar(
        req,
        { status_pengajar, level_pengajar },
        userId
      );
      return responseHandler.succes(res, 'Success update link wawancara for pengajar', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;

const dataPengajarService = require('../services/dataPengajar.service');

class AdminDashboardController {
  static async dataPengajar(req, res, next) {
    try {
      const result = await dataPengajarService.dataPengajarAll();
      return responseHandler.succes(res, 'Success get data pengajar all', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;

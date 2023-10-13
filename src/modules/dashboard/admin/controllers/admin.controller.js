const dataPengajarService = require('../services/dataPengajar.service');
const responseHandler = require('./../../../../helpers/responseHandler');

class AdminDashboardController {
  static async dataPengajar(req, res, next) {
    try {
      const { hariBimbingan1, jamBimbingan1, hariBimbingan2, jamBimbingan2 } = req.body;
      const result = await dataPengajarService.dataPengajarAll(
        hariBimbingan1.toUpperCase(),
        jamBimbingan1,
        hariBimbingan2.toUpperCase(),
        jamBimbingan2
      );
      return responseHandler.succes(res, 'Success get data pengajar all', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminDashboardController;

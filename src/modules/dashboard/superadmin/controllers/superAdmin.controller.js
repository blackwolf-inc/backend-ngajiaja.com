const SuperAdminDashboardService = require('../services/superadminDashboard.service.js')
const responseHandler = require('../../../../helpers/responseHandler');

class SuperAdminController {
    static async getAllDataSuperAdminDashboard(req, res, next) {
        const service = new SuperAdminDashboardService();
        try {
            const { month, year } = req.query;
            const result = await service.getDataMonthSuperAdminDashboard(month, year);
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

}

module.exports = SuperAdminController
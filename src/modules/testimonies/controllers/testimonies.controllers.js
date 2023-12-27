const TestimoniesService = require('../services/testimonies.service');
const responseHandler = require('../../../helpers/responseHandler');

class TestimoniesController {
    static async getTestimonies(req, res, next) {
        const service = new TestimoniesService();
        try {
            const { page, pageSize } = req.query;
            const testimonies = await service.getTestimoniesService(page, pageSize);
            return responseHandler.succes(res, 'Success Get Testimonies', testimonies);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TestimoniesController;
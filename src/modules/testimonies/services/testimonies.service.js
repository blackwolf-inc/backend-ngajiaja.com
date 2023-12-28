const db = require('../../.../../../models/index');
const { Testimonies, sequelize } = db;
const { QueryTypes } = require('sequelize');

class TestimoniesService {
    async getTestimoniesService(page = 1, pageSize = 10) {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;
        const base_url = process.env.BASE_URL;

        const testimonies = await sequelize.query(
            `
            SELECT testimony_id, testimony_name, testimony_body, testimony_profession, CONCAT(:base_url, '/images/', testimony_picture) as testimony_picture, testimony_archived 
            FROM Testimonies
            WHERE testimony_archived = 0
            LIMIT :limit OFFSET :offset
            `,
            {
                type: QueryTypes.SELECT,
                replacements: { limit: pageSize, offset: offset, base_url: base_url }
            }
        );

        const totalTestimonies = await sequelize.query(
            `
            SELECT COUNT(*) as total 
            FROM Testimonies
            WHERE testimony_archived = 0
            `,
            { type: QueryTypes.SELECT }
        );

        const totalPages = Math.ceil(totalTestimonies[0].total / pageSize);

        return { testimonies, page, pageSize, totalPages };
    }
}

module.exports = TestimoniesService;
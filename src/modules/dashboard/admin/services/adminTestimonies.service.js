const { Op } = require('sequelize');
const db = require('../../../../models/index');
const { Testimonies, sequelize } = db;

class AdminTestimonies {
    async createTestimonyService(data) {
        const { testimony_name, testimony_body, testimony_profession, testimony_picture, testimony_archived } = data;

        const testimony = await Testimonies.create({
            testimony_name,
            testimony_body,
            testimony_profession,
            testimony_picture,
            testimony_archived
        });

        return testimony;
    }

    async updateTestimonyService(id, data) {
        const { testimony_name, testimony_body, testimony_profession, testimony_picture, testimony_archived } = data;

        const testimony = await Testimonies.findByPk(id);
        if (!testimony) {
            throw new Error('Testimony not found');
        }

        testimony.testimony_name = testimony_name;
        testimony.testimony_body = testimony_body;
        testimony.testimony_profession = testimony_profession;
        testimony.testimony_picture = testimony_picture;
        testimony.testimony_archived = testimony_archived;

        await testimony.save();

        return testimony;
    }

    async deleteTestimonyService(id) {
        const testimony = await Testimonies.findByPk(id);
        if (!testimony) {
            throw new Error('Testimony not found');
        }

        await testimony.destroy();
        return testimony;
    }

    async getTestimonyService(page = 1, pageSize = 10, testimony_name = '') {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;
        const base_url = process.env.BASE_URL;

        const filter = {};
        if (testimony_name) {
            filter.testimony_name = { [Op.like]: `%${testimony_name}%` };
        }

        const totalTestimonies = await Testimonies.count({
            where: filter,
            attributes: {
                include: [[sequelize.literal(`CONCAT('${base_url}/images/', testimony_picture)`), 'testimony_picture']]
            }
        });
        const totalPages = Math.ceil(totalTestimonies / pageSize);

        const testimonies = await Testimonies.findAll({
            where: filter,
            offset: offset,
            limit: pageSize,
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [[sequelize.literal(`CONCAT('${base_url}/images/', testimony_picture)`), 'testimony_picture']]
            }
        });

        return { testimonies, page, pageSize, totalPages };
    }

    async getTestimonyByIdService(id) {
        const base_url = process.env.BASE_URL;

        const testimony = await Testimonies.findByPk(id);

        if (!testimony) {
            throw new Error('Testimony not found');
        }

        return testimony;
    }
}

module.exports = AdminTestimonies;
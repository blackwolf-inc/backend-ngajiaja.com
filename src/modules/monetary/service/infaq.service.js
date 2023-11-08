const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const {
  User,
  Bank,
  Infaq,
  Period,
  Peserta,
  Pengajar,
  PenghasilanPengajar,
} = require('../../../models');
const { Op, Sequelize } = require('sequelize');

class InfaqService extends BaseService {
  async checkUserById(payload) {
    const result = await User.findOne({ id: payload.user_id });
    if (!result) throw ApiError.notFound(`User with id ${id} not found`);
    return result;
  }
  async checkPesertaById(payload) {
    let id = payload.peserta_id;
    const result = await Peserta.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Peserta with id ${id} not found`);
    return result;
  }
  async checkPengajarById(payload) {
    let id = payload.pengajar_id;
    const result = await Pengajar.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Pengajar with id ${id} not found`);
    return result;
  }
  async checkBankById(payload) {
    let id = payload.bank_id;
    const result = await Bank.findOne({ id });
    if (!result) throw ApiError.notFound(`Bank with id ${id} not found`);
    return result;
  }
  async checkPeriodById(payload) {
    let id = payload.periode_id;
    const result = await Period.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Period with id ${id} not found`);
    return result;
  }
  async checkInfaqById(id) {
    const result = await Infaq.findOne({ id });
    if (!result) throw ApiError.notFound(`Infaq with id ${id} not found`);
    return result;
  }

  async getAllInfaqByUserId(id, role, query) {
    let userWhere = {};
    let whereClause = {};
    console.log(role);

    if (query.instructorName) {
      userWhere.nama = { [Op.like]: `%${query.instructorName}%` };
    }
    if (role == 'PESERTA') {
      whereClause.peserta_id = id;
    } else if (role == 'PENGAJAR') {
      whereClause.pengajar_id = id;
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.startDate && query.endDate) {
      whereClause.waktu_pembayaran = { [Op.between]: [query.startDate, query.endDate] };
    }

    const includeQuery = [
      {
        model: Pengajar,
        required: true,
        attributes: {
          exclude: ['user_id'],
        },
        as: 'pengajar',
        attributes: ['id'],
        include: [
          {
            model: User,
            required: true,
            as: 'user',
            attributes: ['nama'],
            where: userWhere,
          },
        ],
      },
      {
        model: Bank,
        as: 'bank',
      },
    ];

    const result = await this.__findAll({ where: whereClause }, includeQuery);
    const totalPage = Math.ceil(result.total / parseInt(query.paginate ? query.paginate : 1));
    return {
      result,
      page: parseInt(query.page) ? parseInt(query.page) : 1,
      totalPage: parseInt(totalPage),
      paginate: parseInt(query.paginate) ? parseInt(query.paginate) : 10,
      total: parseInt(result.total),
    };
  }

  async updateImages(req) {
    if (req.file) {
      const imageUrl = `${req.file.filename}`;
      req.body.bukti_pembayaran = imageUrl;
    } else {
      throw ApiError.badRequest(`Image not found`);
    }
  }

  async updateDateNow(req) {
    if (req) {
      req.body.waktu_pembayaran = Date.now();
    } else {
      throw ApiError.badRequest('Invalid Date');
    }
  }

  async getPesertaByUserId(id) {
    const result = await Peserta.findOne({ where: { user_id: id } });

    if (!result) throw ApiError.notFound("Peserta does't exist");

    return result;
  }

  async getPengajarByUserId(id) {
    const result = await Pengajar.findOne({ where: { user_id: id } });

    if (!result) throw ApiError.notFound("Pengajar does't exist");

    return result;
  }

  async addToPenghasilanPengajar(req) {
    const penguranganPenghasilan = (50 / 100) * parseFloat(req.nominal);

    const data = {
      pengajar_id: req.pengajar_id,
      peserta_id: req.peserta_id,
      pembayaran: req.nominal,
      penghasilan: parseFloat(req.nominal) - penguranganPenghasilan,
      persentase_bagi_hasil: 50,
      waktu_pembayaran: req.waktu_pembayaran,
    };
    const result = await PenghasilanPengajar.create(data);
  }
}

module.exports = InfaqService;

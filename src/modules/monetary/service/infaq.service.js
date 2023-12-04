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
const { Op, where } = require('sequelize');
const fs = require('fs/promises');
const path = require('path');

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

    let modifiedResult;

    modifiedResult = result.datas.map((item) => {
      return {
        ...item, // Jika `dataValues` tidak ada, sesuaikan dengan struktur aktual
        bukti_pembayaran: item.bukti_pembayaran
          ? `${process.env.BASE_URL}/images/${item.bukti_pembayaran}`
          : null,
      };
    });

    return {
      result: modifiedResult,
      page: parseInt(query.page) ? parseInt(query.page) : 1,
      totalPage: parseInt(totalPage),
      paginate: parseInt(query.paginate) ? parseInt(query.paginate) : 10,
      total: parseInt(result.total),
    };
  }

  async getOneInfaqById(id) {
    const result = await this.__findOne({ where: { id } }, this.#includeQuery);

    let modifiedResult;

    modifiedResult = {
      ...result,
      bukti_pembayaran: result.bukti_pembayaran
        ? `${process.env.BASE_URL}/images/${result.bukti_pembayaran}`
        : null,
    };

    return modifiedResult;
  }

  async insertImages(req) {
    if (req.file) {
      const imageUrl = `${req.file.filename}`;
      req.body.bukti_pembayaran = imageUrl;
    } else {
      throw ApiError.badRequest(`Image not found`);
    }
  }
  async updateImages(req) {
    if (req.file) {
      const imageUrl = `${req.file.filename}`;
      req.body.bukti_pembayaran = imageUrl;

      const result = await Infaq.findOne({ where: { id: req.params.id } });
      if (result.bukti_pembayaran) {
        await fs.unlink(path.join(process.cwd(), `../images/${result.bukti_pembayaran}`), () => { });
      }
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
    const pengajar = await Pengajar.findByPk(req.pengajar_id);

    if (!pengajar) {
      throw new Error('Pengajar not found');
    }

    // const penguranganPenghasilan = (pengajar.persentase_bagi_hasil / 100) * parseFloat(req.nominal);

    const data = {
      pengajar_id: req.pengajar_id,
      peserta_id: req.peserta_id,
      pembayaran: req.nominal,
      penghasilan: ((parseFloat(req.nominal) * pengajar.persentase_bagi_hasil) / 100),
      persentase_bagi_hasil: pengajar.persentase_bagi_hasil,
      waktu_pembayaran: req.waktu_pembayaran,
    };

    const result = await PenghasilanPengajar.create(data);
  }

  #includeQuery = [
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
        },
      ],
    },
    {
      model: Bank,
      as: 'bank',
    },
  ];
}

module.exports = InfaqService;

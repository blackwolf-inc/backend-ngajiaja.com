const BaseService = require('../../../../base/base.service');
const { Peserta, User, Bank, Pencairan, Pengajar } = require('../../../../models');
const ApiError = require('../../../../helpers/errorHandler');
const fs = require('fs/promises');
const path = require('path');
const { Op } = require('sequelize');

class AdminTransaksiService extends BaseService {
  async getInfaqPeserta(query) {
    let userWhere = {};
    let userPengajarWhere = {};
    let whereClause = {};
    let bankWhere = {};

    const base_url = process.env.BASE_URL;

    if (query.studentName) {
      userWhere.nama = { [Op.like]: `%${query.studentName}%` };
    }

    if (query.teacherName) {
      userPengajarWhere.nama = { [Op.like]: `%${query.teacherName}%` };
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.startDate && query.endDate) {
      whereClause.waktu_pembayaran = { [Op.between]: [query.startDate, query.endDate] };
    }

    if (query.metode) {
      bankWhere.nama_bank = { [Op.like]: `%${query.metode}%` };
    }

    const includeQuery = [
      {
        model: Peserta,
        required: true,
        as: 'peserta',
        attributes: ['id'],
        include: [
          {
            model: User,
            required: true,
            as: 'user',
            attributes: ['nama', 'profile_picture'],
            where: userWhere,
          },
        ],
      },
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
            attributes: ['nama', 'profile_picture'],
            where: userPengajarWhere,
          },
        ],
      },
      {
        model: Bank,
        as: 'bank',
        where: bankWhere,
      },
    ];

    const result = await this.__findAll({ where: whereClause }, includeQuery);

    const totalPage = Math.ceil(result.total / parseInt(query.paginate, 10) || 1);

    const modifiedResult = result.datas.map((item) => {
      return {
        id: item.id,
        id_peserta: item.peserta.id,
        nama_peserta: item.peserta.user.nama,
        profile_picture_peserta: item.peserta.user.profile_picture ? `${base_url}/images/${item.peserta.user.profile_picture}` : null,
        id_pengajar: item.pengajar.id,
        nama_pengajar: item.pengajar.user.nama,
        profile_picture_pengajar: item.pengajar.user.profile_picture ? `${base_url}/images/${item.pengajar.user.profile_picture}` : null,
        status: item.status,
        metode: item.bank.nama_bank,
        nominal: item.nominal,
        waktu_pembayaran: item.waktu_pembayaran,
        bukti_pembayaran: item.bukti_pembayaran
          ? `${process.env.BASE_URL}/images/${item.bukti_pembayaran}`
          : null,
      };
    });

    return {
      result: modifiedResult,
      page: parseInt(query.page, 10) || 1,
      totalPage: totalPage,
      paginate: parseInt(query.paginate, 10) || 10,
      total: parseInt(result.total),
    };
  }

  async getPencairanPengajar(query) {
    let userWhere = {};
    let whereClause = {};

    if (query.instructorName) {
      userWhere.nama = { [Op.like]: `%${query.instructorName}%` };
    }

    if (query.status) {
      whereClause.status = query.status;
    }

    if (query.startDate && query.endDate) {
      whereClause.waktu_pembayaran = { [Op.between]: [query.startDate, query.endDate] };
    }

    const includeQuery = [
      {
        model: User,
        required: true,
        as: 'user',
        attributes: ['nama'],
        where: userWhere,
      },
    ];

    const result = await this.__findAll({ where: whereClause }, includeQuery);

    const totalPage = Math.ceil(result.total / parseInt(query.paginate, 10) || 1);

    const modifiedResult = result.datas.map((item) => {
      return {
        id: item.id,
        nama_pengajar: item.user.nama,
        status: item.status,
        nominal: item.nominal,
        waktu_pembayaran: item.waktu_pembayaran,
        bukti_pembayaran: item.bukti_pembayaran
          ? `${process.env.BASE_URL}/images/${item.bukti_pembayaran}`
          : null,
      };
    });

    return {
      result: modifiedResult,
      page: parseInt(query.page, 10) || 1,
      totalPage: totalPage,
      paginate: parseInt(query.paginate, 10) || 10,
      total: parseInt(result.total),
    };
  }

  async checkPencairanById(id) {
    const result = await Pencairan.findOne({ where: { id } });
    if (!result) throw ApiError.notFound(`Pencairan with id ${id} not found`);
    return result;
  }

  async updateImages(req) {
    if (req.file) {
      const imageUrl = `${req.file.filename}`;
      req.body.bukti_pembayaran = imageUrl;

      const result = await Pencairan.findOne({ where: { id: req.params.id } });
      if (result.bukti_pembayaran) {
        await fs.unlink(path.join(process.cwd(), `../images/${result.bukti_pembayaran}`), () => { });
      }
    } else {
      throw ApiError.badRequest(`Image not found`);
    }
  }

  async exportInfaqPeserta(startDate = '2023-01-01', endDate = '2023-12-31') {
    let userWhere = {};
    let whereClause = {};
    let bankWhere = {};

    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [startDate, endDate] };
    }

    const includeQuery = [
      {
        model: Peserta,
        required: true,
        as: 'peserta',
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
        where: bankWhere,
      },
    ];

    const result = await this.__findAll({ where: whereClause }, includeQuery);

    const modifiedResult = result.datas.map((item) => {
      return {
        id: item.id,
        nama_peserta: item.peserta.user.nama,
        status: item.status,
        metode: item.bank.nama_bank,
        nominal: item.nominal,
        waktu_pembayaran: item.waktu_pembayaran,
        bukti_pembayaran: item.bukti_pembayaran
          ? `${process.env.BASE_URL}/images/${item.bukti_pembayaran}`
          : null,
        createdAt: item.createdAt,
        editedAt: item.editedAt
      };
    });

    return modifiedResult;
  }
}

module.exports = AdminTransaksiService;

const { QueryTypes, where } = require('sequelize');
// const ApiError = require('../../../helpers/errorHandler');
const db = require('../../../../models/index');
const { User, BimbinganReguler, BimbinganTambahan, Pengajar, JadwalMengajarPengajar, sequelize } =
  db;
const BaseService = require('./../../../../base/base.service');
const { Op } = require('sequelize');

class DashboardPesertaService extends BaseService {
  async getDataBimbingan(id) {
    const [bimbingan_saya, total_tidak_hadir, total_infaq] = await Promise.all([
      sequelize.query(
        `
        SELECT COUNT(*) AS total
        FROM (
          SELECT br.period_id
          FROM BimbinganRegulers br
          WHERE br.period_id IN (
            SELECT id
            FROM Periods p
            WHERE p.peserta_id = :pesertaId
            AND p.status = 'ACTIVATED'
          )
          UNION ALL
          SELECT bt.period_id
          FROM BimbinganTambahans bt
          WHERE bt.period_id IN (
            SELECT id
            FROM Periods p
            WHERE p.peserta_id = :pesertaId
            AND p.status = 'ACTIVATED'
          )
        ) AS combined_periods
        `,
        {
          replacements: { pesertaId: id },
          type: QueryTypes.SELECT,
        }
      ),
      sequelize.query(
        `
        SELECT SUM(CASE WHEN br.absensi_peserta = 0 THEN 1 ELSE 0 END) AS total
        FROM BimbinganRegulers br
        WHERE br.period_id IN (
        SELECT id
        FROM Periods p
        WHERE p.peserta_id = :pesertaId
        AND p.status = 'ACTIVATED'
        )
        UNION ALL
        SELECT SUM(CASE WHEN bt.absensi_peserta = 0 THEN 1 ELSE 0 END) AS total
        FROM BimbinganTambahans bt
        WHERE bt.period_id IN (
        SELECT id
        FROM Periods p
        WHERE p.peserta_id = :pesertaId
        AND p.status = 'ACTIVATED'
        )
        `,
        {
          replacements: { pesertaId: id },
          type: QueryTypes.SELECT,
        }
      ),
      sequelize.query(
        `
        SELECT
            peserta_id,
            SUM(nominal) AS total   
        FROM Infaqs
        WHERE peserta_id = :pesertaId 
            AND status = "ACCEPTED"
        `,
        {
          replacements: { pesertaId: id },
          type: QueryTypes.SELECT,
        }
      ),
    ]);

    return {
      bimbingan_saya: bimbingan_saya[0].total,
      total_tidak_hadir: parseInt(total_tidak_hadir[0].total ? total_tidak_hadir[0].total : 0),
      total_infaq: total_infaq[0].total ? total_infaq[0].total : 0,
    };
  }

  async getBimbinganPeserta(id, query) {
    const userWhere = {};
    const dateWhere = {};

    const whereClause = {
      where: { peserta_id: id },
    };

    if (query.instructorName) {
      userWhere.nama = { [Op.like]: `%${query.instructorName}%` };
    }
    if (query.status) {
      whereClause.where.status = query.status;
    }

    if (query.startDate && query.endDate) {
      // Parse tanggal dari format "2023-10-21" ke format "21 Nov 2023"
      const startDateParts = query.startDate.split('-');
      const startDateFormatted = `${startDateParts[2]} ${getMonthName(
        parseInt(startDateParts[1])
      )} ${startDateParts[0]}`;

      const endDateParts = query.endDate.split('-');
      const endDateFormatted = `${endDateParts[2]} ${getMonthName(parseInt(endDateParts[1]))} ${
        endDateParts[0]
      }`;

      dateWhere.tanggal = { [Op.between]: [startDateFormatted, endDateFormatted] };
    }
    const includeQuery = [
      {
        model: Pengajar,
        required: true,
        as: 'pengajar',
        attributes: ['user_id', 'id'],
        include: [
          {
            model: User,
            as: 'user',
            required: true,
            attributes: ['nama', 'jenis_kelamin'],
            where: userWhere,
          },
          {
            model: JadwalMengajarPengajar,
            as: 'jadwal_mengajar',
          },
        ],
      },
      {
        model: BimbinganReguler,
        separate: true,
        as: 'bimbingan_reguler',
        where: dateWhere,
      },
      {
        model: BimbinganTambahan,
        separate: true,
        as: 'bimbingan_tambahan',
        where: dateWhere,
      },
    ];

    const result = await this.__findAll(whereClause, includeQuery);
    const totalPage = Math.ceil(result.total / parseInt(query.paginate ? query.paginate : 1));

    return {
      result,
      page: parseInt(query.page) ? parseInt(query.page) : 1,
      totalPage: parseInt(totalPage),
      paginate: parseInt(query.paginate) ? parseInt(query.paginate) : 10,
      total: parseInt(result.total),
    };
  }
}

function getMonthName(month) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[month - 1];
}

module.exports = DashboardPesertaService;

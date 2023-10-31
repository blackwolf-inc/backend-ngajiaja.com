const { QueryTypes } = require('sequelize');
// const ApiError = require('../../../helpers/errorHandler');
const db = require('../../../../models/index');
const { User, Peserta, Period, BimbinganReguler, BimbinganTambahan, Pengajar, sequelize } = db;
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
      total_tidak_hadir: parseInt(total_tidak_hadir[0].total),
      total_infaq: total_infaq[0].total ? total_infaq[0].total : 0,
    };
  }

  async getBimbinganPeserta(id, query) {
    const { page = 1, pageSize = 10, instructorName, startDate, endDate } = query;

    const whereClause = {
      id,
    };

    const includeQuery = [
      {
        model: Period,
        as: 'period',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: Pengajar,
            as: 'pengajar',
            attributes: ['user_id', 'id'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['nama'],
                where: instructorName
                  ? {
                      nama: {
                        [Op.like]: `%${instructorName}%`,
                      },
                    }
                  : {},
              },
            ],
          },
          {
            model: BimbinganReguler,
            as: 'bimbingan_reguler',
            attributes: ['id', 'period_id', 'hari_bimbingan', 'jam_bimbingan'],
            separate: true,
          },
          {
            model: BimbinganTambahan,
            as: 'bimbingan_tambahan',
            separate: true,
          },
        ],
      },
    ];

    if (startDate && endDate) {
      whereClause['period.start_date'] = { [Op.between]: [startDate, endDate] };
    }

    const result = await Peserta.findAndCountAll({
      where: whereClause,
      include: includeQuery,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return {
      total: result.count,
      datas: result.rows,
    };
  }
}

module.exports = DashboardPesertaService;

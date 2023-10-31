const BaseService = require('../../../../base/base.service');
const ApiError = require('../../../../helpers/errorHandler');
const {
  BimbinganReguler,
  BimbinganTambahan,
  Peserta,
  JadwalBimbinganPeserta,
  User,
} = require('../../../../models');
const moment = require('moment');

class PengajarService extends BaseService {
  async getPengajarByUserId(id) {
    const result = await this.__findOne({ where: { user_id: id } });
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);
    return result;
  }

  async bimbinganPending(id) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'WAITING' } },
      this.#includeQueryBimbinganPending,
      'createdAt',
      'ASC',
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    for (const period of result.datas) {
      period.last_approved = moment(period.createdAt).add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
    }

    return result;
  }

  async bimbinganOnGoing(id) {
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'ACTIVATED' } },
      this.#includeQueryBimbinganOnGoing,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);
    return result;
  }

  async filterPesertaByName(id, pesertaName) {
    const result = await this.bimbinganPending(id);
    if (pesertaName.length < 3)
      throw ApiError.badRequest('Peserta name must be at least 3 characters');
    const filteredPeserta = result.datas.filter((d) => {
      return d.peserta.User.nama.includes(pesertaName);
    });
    if (!filteredPeserta) throw ApiError.notFound(`Peserta with name ${pesertaName} not found`);
    return filteredPeserta;
  }

  async getBimbinganActivated(id) {
    const pengajar = await this.getPengajarByUserId(id);
    const result = await this.__findAll(
      { where: { pengajar_id: pengajar.id, status: 'ACTIVATED' } },
      {},
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);
    return result.length;
  }

  async getIncome(id) {}

  #includeQueryBimbinganPending = [
    {
      model: Peserta,
      as: 'peserta',
      include: [
        {
          model: JadwalBimbinganPeserta,
          attributes: {
            exclude: ['peserta_id'],
          },
          as: 'jadwal_bimbingan_peserta',
        },
        {
          model: User,
          attributes: {
            exclude: ['password', 'token'],
          },
        },
      ],
    },
  ];

  #includeQueryBimbinganOnGoing = [
    {
      model: Peserta,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'peserta',
      includes: [
        {
          model: User,
          attributes: {
            exclude: ['password', 'token'],
          },
        },
      ],
    },
    {
      model: BimbinganReguler,
      attributes: {
        exclude: ['period_id'],
      },
      as: 'bimbingan_reguler',
    },
    {
      model: BimbinganTambahan,
      attributes: {
        exclude: ['period_id'],
      },
      as: 'bimbingan_tambahan',
    },
  ];
}

module.exports = PengajarService;

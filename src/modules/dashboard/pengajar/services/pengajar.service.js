const BaseService = require('../../../../base/base.service');
const ApiError = require('../../../../helpers/errorHandler');
const {
  BimbinganReguler,
  BimbinganTambahan,
  Peserta,
  JadwalBimbinganPeserta,
  User,
} = require('../../../../models');

class PengajarService extends BaseService {
  static async getPengajarByUserId(id) {
    const result = await this.getOneById(id);
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);
    return result;
  }

  static async getBimbinganWaiting(id) {
    await this.getPengajarByUserId(id);
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'WAITING' } },
      this.#includeQueryBimbinganWaiting,
    );
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);

    for (const period of result) {
      result.lastApproved = result.createdAt.getTime() + 60 * 60 * 1000;
    }

    return result;
  }

  static async getBimbinganComing(id) {
    await this.getPengajarByUserId(id);
    const result = await this.__findAll(
      { where: { pengajar_id: id, status: 'ACTIVATED' } },
      this.#includeQueryBimbinganWaiting,
    );
  }

  static async filterPesertaByName(pengajarId, pesertaName) {
    await this.getPengajarByUserId(pengajarId);
    const data = await this.getBimbinganWaiting(pengajarId);
    const filteredPeserta = data.filter((d) => {
      d.peserta.user.name.includes(pesertaName);
    });
    if (!filteredPeserta) throw ApiError.notFound(`Peserta with name ${pesertaName} not found`);
    return filteredPeserta;
  }

  static async getTotalBimbinganActivated(id) {
    await this.getPengajarByUserId(id);
    const result = await this.__findAll({ where: { pengajar_id: id, status: 'ACTIVATED' } });
    if (!result) throw ApiError.notFound(`Pengajar with user id ${id} not found`);
    return result.length;
  }

  static async getTotalIncome(id) {}

  #includeQueryBimbinganWaiting = [
    {
      model: Peserta,
      as: 'peserta',
      includes: [
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
          as: 'user',
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

const BaseService = require('../../../base/base.service');
const ApiError = require('../../../helpers/errorHandler');
const { User, Peserta, Pengajar, Pencairan } = require('../../../models');
const moment = require('moment');

class PenghasilanService extends BaseService {
  async dataIncome(id, startDate, endDate, pesertaName, persen) {
    const result = await this.__findAll({ where: { pengajar_id: id } }, this.#includeQuery);
    if (!result) throw ApiError.notFound(`Pengajar with id ${id} not found`);

    const data = [];
    for (const item of result.datas) {
      const dataPenghasilan = {
        id: item.id,
        peserta: item.peserta.user.nama,
        peserta_id: item.peserta.id,
        user_id: item.peserta.user.id,
        payed: item.pembayaran,
        income: item.penghasilan,
        percent: item.persentase_bagi_hasil,
        time: item.waktu_pembayaran,
      };
      data.push(dataPenghasilan);
    }

    let filteredData;
    if (startDate && endDate) {
      if (pesertaName) {
        if (persen) {
          filteredData = data.filter(
            (item) =>
              moment(item.time) >= moment(startDate) &&
              moment(item.time) <= moment(endDate) &&
              item.peserta.toLowerCase().includes(pesertaName.toLowerCase()) &&
              item.percent === persen,
          );
        } else {
          filteredData = data.filter(
            (item) =>
              moment(item.time) >= moment(startDate) &&
              moment(item.time) <= moment(endDate) &&
              item.peserta.toLowerCase().includes(pesertaName.toLowerCase()),
          );
        }
      } else if (persen) {
        filteredData = data.filter(
          (item) =>
            moment(item.time) >= moment(startDate) &&
            moment(item.time) <= moment(endDate) &&
            item.percent === persen,
        );
      } else {
        filteredData = data.filter(
          (item) => moment(item.time) >= moment(startDate) && moment(item.time) <= moment(endDate),
        );
      }
    }

    if (pesertaName) {
      if (persen) {
        filteredData = data.filter(
          (item) =>
            item.peserta.toLowerCase().includes(pesertaName.toLowerCase()) &&
            item.percent === persen,
        );
      } else {
        filteredData = data.filter((item) =>
          item.peserta.toLowerCase().includes(pesertaName.toLowerCase()),
        );
      }
    }

    if (persen) {
      filteredData = data.filter((item) => item.percent === persen);
    }

    if (filteredData) {
      if (filteredData.length === 0) throw ApiError.badRequest('Data not found');

      return filteredData;
    }

    return data;
  }

  async totalIncome(id) {
    const result = await this.dataIncome(id);
    if (!result) throw ApiError.notFound(`Pengajar with id ${id} not found`);

    let total = 0;
    for (const item of result) {
      total += item.income;
    }

    return total;
  }

  #includeQuery = [
    {
      model: Peserta,
      as: 'peserta',
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password', 'token'],
          },
        },
      ],
    },
  ];
}

module.exports = PenghasilanService;

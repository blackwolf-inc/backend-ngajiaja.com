const BaseService = require('../../../base/base.service');
const { USER_ROLE } = require('../../../helpers/constanta');
const ApiError = require('../../../helpers/errorHandler');
const { sequelize, Pengajar, Peserta } = require('../../../models');

class UserService extends BaseService {
  async getUserByEmail(email) {
    const data = await this.__findOne({ where: { email } });
    if (!data) {
      throw ApiError.badRequest(`Email ${email} not found`);
    }

    return data;
  }

  async getOneUser(paramId) {
    const data = await this.__findOne({
      where: { id: paramId },
      include: this.#includeQuery,
    });
    if (!data) {
      throw ApiError.badRequest(`${this.db.name} not found`);
    }

    return data;
  }

  async getAllUsers(query, fieldOrder = 'updatedAt', ascDescOrder = 'DESC') {
    let { paginate, page } = this.req.query;
    let paginationCondition;

    if (paginate && page) {
      paginationCondition = {
        limit: Number(paginate),
        offset: Number(page - 1) * Number(paginate),
      };
    } else {
      paginationCondition = {};
    }

    const [datas, total_datas] = await Promise.all([
      this.db.findAll({
        ...query,
        include: this.#includeQuery,
        ...paginationCondition,
        order: [[fieldOrder, ascDescOrder]],
      }),
      this.db.findAll({
        ...query,
        include: this.#includeQuery,
        order: [[fieldOrder, ascDescOrder]],
      }),
    ]);

    const [resultDatas, resultTotalDatas] = await Promise.all([
      this.jsonParseHandler(datas),
      this.jsonParseHandler(total_datas),
    ]);

    return {
      total: resultTotalDatas.length,
      datas: resultDatas,
    };
  }

  async checkIsEmailExist(email) {
    const data = await this.__findOne({ where: { email } });
    if (!!data) {
      throw ApiError.badRequest(`Email ${email} already exist`);
    }
  }

  async roleCreationUser() {
    if (this.req.user && this.req.user.role !== 'ADMIN' && this.req.body.role === 'ADMIN') {
      throw ApiError.badRequest('You can not create ADMIN role');
    }
  }

  async updateUserData(payload, whereQuery) {
    const user = await this.getOneById(whereQuery.id);

    if (payload.status) {
      await this.#updateStatusHandler(payload.status, user);
    }

    const data = await sequelize.transaction((t) => {
      return this.__update(payload, { where: { ...whereQuery } }, t);
    });
    if (data.length > 0) {
      const afterUpdateData = await this.getOneById(whereQuery.id);
      return afterUpdateData;
    } else {
      throw new Error(`Failed update ${this.db.name}`);
    }
  }

  async #updateStatusHandler(status, user) {
    if (status && user.role === USER_ROLE.PENGAJAR) {
      const statusPengajar = [
        'REGISTERED',
        'WAITING',
        'INTERVIEWED',
        'REJECTED',
        'ACTIVE',
        'NONACTIVE',
      ].indexOf(status);
      if (statusPengajar < 0)
        throw ApiError.badRequest(
          'User role must be REGISTERED / WAITING / INTERVIEWED / REJECTED / ACTIVE / NONACTIVE'
        );
    } else if (status && user.role === USER_ROLE.PESERTA) {
      const statusPeserta = [
        'REGISTERED',
        'ADMINISTRATION',
        'REJECTED',
        'ACTIVE',
        'NONACTIVE',
      ].indexOf(status);
      if (statusPeserta < 0)
        throw new Error(
          'User role must be REGISTERED / ADMINISTRATION / REJECTED / ACTIVE / NONACTIVE'
        );
    }
  }

  #includeQuery = [
    {
      model: Pengajar,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'pengajar',
    },
    {
      model: Peserta,
      attributes: {
        exclude: ['user_id'],
      },
      as: 'peserta',
    },
  ];
}

module.exports = UserService;

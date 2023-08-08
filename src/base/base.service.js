const ApiError = require('../helpers/errorHandler');
const { sequelize } = require('../models');
const BaseRepository = require('./base.repository');

class BaseService extends BaseRepository {
  async getOneById(paramId) {
    const data = await this.__findOne({ where: { id: paramId } });
    if (!data) {
      throw ApiError.badRequest(`${this.db.name} not found`);
    }
    return data;
  }

  async getAll(whereQuery = {}) {
    const datas = await this.__findAll({ where: whereQuery });
    return datas;
  }

  async createData(payload) {
    const data = await sequelize.transaction((t) => {
      return this.__create(payload, t);
    });
    return data;
  }

  async updateData(payload, whereQuery) {
    await this.getOneById(whereQuery.id);
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

  async deleteData(paramId) {
    await this.getOneById(paramId);
    const dataDeleted = await sequelize.transaction((t) => {
      return this.__remove({ where: { id: paramId } }, t);
    });
    if (dataDeleted > 0) {
      return dataDeleted;
    } else {
      throw new Error(`Failed delete ${this.db.name}`);
    }
  }
}

module.exports = BaseService;

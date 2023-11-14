const BaseService = require('../../../../base/base.service');
const ApiError = require('../../../../helpers/errorHandler');
const { sequelize, Peserta } = require('../../../../models');

class UserService extends BaseService {
  async getOneUser(paramId) {
    const data = await this.__findOne(
      { where: { id: paramId, role: 'PESERTA' } },
      this.#includeQuery
    );
    if (!data) {
      throw ApiError.badRequest(`${this.db.name} not found`);
    }

    return data;
  }

  async updateUserData(payload, whereQuery) {
    await this.getOneById(whereQuery.id);

    const [user, peserta] = await sequelize.transaction(async (t) => {
      const peserta = await Peserta.update(
        { profesi: payload.profesi },
        { where: { user_id: whereQuery.id } },
        t
      );
      const user = await this.__update(payload, { where: { ...whereQuery } }, t);

      return [user, peserta];
    });

    if (user[0] != 1 && peserta[0] != 1) {
      throw ApiError.badRequest(`failed update peserta`);
    } else {
      const result = this.getOneUser(whereQuery.id);
      return result;
    }
  }

  async updateImages(req) {
    console.log(req.file);
    if (req.file) {
      const imageUrl = `${req.file.filename}`;
      req.body.avatar = imageUrl;
    } else {
      throw ApiError.badRequest(`Image not found`);
    }
  }

  #includeQuery = {
    model: Peserta,
    attributes: {
      exclude: ['user_id'],
    },
    as: 'peserta',
  };
}

module.exports = UserService;

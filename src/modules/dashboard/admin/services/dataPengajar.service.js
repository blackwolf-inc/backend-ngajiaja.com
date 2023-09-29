const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Pengajar, sequelize } = db;

class DataPengajarService {
  async dataPengajarAll() {
    const query = await sequelize.query(``, { type: QueryTypes.SELECT });

    if (query[0].total > 0) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = new DataPengajarService();

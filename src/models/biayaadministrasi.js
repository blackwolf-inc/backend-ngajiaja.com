'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BiayaAdministrasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BiayaAdministrasi.init({
    bank_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    bukti_pembayaran: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BiayaAdministrasi',
  });
  return BiayaAdministrasi;
};
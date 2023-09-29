'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Period extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Period.init(
    {
      tipe_bimbingan: DataTypes.STRING,
      peserta_id: DataTypes.INTEGER,
      pengajar_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      catatan_peserta: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'Periods',
      modelName: 'Period',
    }
  );
  return Period;
};

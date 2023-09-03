'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JadwalBimbinganPeserta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JadwalBimbinganPeserta.belongsTo(models.Peserta, {
        foreignKey: 'peserta_id',
        as: 'peserta',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  JadwalBimbinganPeserta.init(
    {
      peserta_id: DataTypes.INTEGER,
      hari_bimbingan_1: DataTypes.STRING,
      jam_bimbingan_1: DataTypes.STRING,
      hari_bimbingan_2: DataTypes.STRING,
      jam_bimbingan_2: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'JadwalBimbinganPeserta',
    }
  );
  return JadwalBimbinganPeserta;
};

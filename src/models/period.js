'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Period extends Model {
    static associate(models) {
      Period.hasMany(models.BimbinganReguler, {
        foreignKey: 'period_id',
        as: 'bimbingan_reguler',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Period.hasMany(models.BimbinganTambahan, {
        foreignKey: 'period_id',
        as: 'bimbingan_tambahan',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Period.belongsTo(models.Peserta, {
        foreignKey: 'peserta_id',
        as: 'peserta',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Period.belongsTo(models.Pengajar, {
        foreignKey: 'pengajar_id',
        as: 'pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
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

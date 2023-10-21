'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BimbinganReguler extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BimbinganReguler.belongsTo(models.Period, {
        foreignKey: 'period_id',
        as: 'period',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  BimbinganReguler.init(
    {
      period_id: DataTypes.INTEGER,
      tanggal: DataTypes.STRING,
      hari_bimbingan: DataTypes.STRING,
      jam_bimbingan: DataTypes.STRING,
      absensi_peserta: DataTypes.INTEGER,
      absensi_pengajar: DataTypes.INTEGER,
      catatan_pengajar: DataTypes.TEXT,
      keterangan_izin_peserta: DataTypes.TEXT,
      tanggal_pengingat_infaq: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: 'BimbinganReguler',
    }
  );
  return BimbinganReguler;
};

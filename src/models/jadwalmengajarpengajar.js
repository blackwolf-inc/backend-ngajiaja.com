'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JadwalMengajarPengajar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JadwalMengajarPengajar.belongsTo(models.Pengajar, {
        foreignKey: 'pengajar_id',
        as: 'pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  JadwalMengajarPengajar.init(
    {
      pengajar_id: DataTypes.INTEGER,
      hari_mengajar: DataTypes.STRING,
      mulai_mengajar: DataTypes.TIME,
      selesai_mengajar: DataTypes.TIME,
      status_libur: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'JadwalMengajarPengajar',
    }
  );
  return JadwalMengajarPengajar;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pencairan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Relation to User
      Pencairan.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Pencairan.belongsTo(models.Pengajar, {
        foreignKey: 'pengajar_id',
        as: 'pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Pencairan.init(
    {
      user_id: DataTypes.INTEGER,
      pengajar_id: DataTypes.INTEGER,
      nama_bank: DataTypes.STRING,
      no_rekening: DataTypes.STRING,
      nama_rekening: DataTypes.STRING,
      status: DataTypes.STRING,
      nominal: DataTypes.DOUBLE,
      waktu_pembayaran: DataTypes.DATE,
      bukti_pembayaran: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Pencairan',
    },
  );
  return Pencairan;
};

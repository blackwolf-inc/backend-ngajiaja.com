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
      //Relation to Bank
      Pencairan.belongsTo(models.Bank, {
        foreignKey: 'user_id',
        as: 'bank',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      //Relation to User
      Pencairan.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Pencairan.init(
    {
      user_id: DataTypes.INTEGER,
      bank_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      nominal: DataTypes.DOUBLE,
      waktu_pembayaran: DataTypes.DATE,
      bukti_pembayaran: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Pencairan',
    }
  );
  return Pencairan;
};

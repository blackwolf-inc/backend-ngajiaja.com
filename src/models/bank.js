'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relation to Biaya administrasi
      Bank.hasMany(models.BiayaAdministrasi, {
        foreignKey: 'bank_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Bank.init(
    {
      nama_bank: DataTypes.STRING,
      atas_nama: DataTypes.STRING,
      no_rekening: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Bank',
    }
  );
  return Bank;
};

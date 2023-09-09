'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relation to teacher
      User.hasOne(models.Pengajar, {
        foreignKey: 'user_id',
        as: 'pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // Relation to student
      User.hasOne(models.Peserta, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      // Relation to Biaya administrasi
      User.hasOne(models.BiayaAdministrasi, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  User.init(
    {
      role: DataTypes.STRING,
      nama: DataTypes.STRING,
      email: DataTypes.STRING,
      telp_wa: DataTypes.STRING,
      jenis_kelamin: DataTypes.STRING,
      alamat: DataTypes.STRING,
      tgl_lahir: DataTypes.DATE,
      status: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User',
    }
  );
  return User;
};

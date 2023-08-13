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
      // define association here
      User.hasOne(models.Student, {
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
      usia: DataTypes.INTEGER,
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

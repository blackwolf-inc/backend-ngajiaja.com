'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserResetPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserResetPassword.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

    }
  }
  UserResetPassword.init({
    user_id: DataTypes.INTEGER,
    reset_token: DataTypes.STRING,
    expired_date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'UserResetPassword',
  });
  return UserResetPassword;
};
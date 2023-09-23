'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Infaq extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Infaq.belongsTo(models.Period, {
        foreignKey: 'period_id',
        as: 'periode',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Infaq.belongsTo(models.Bank, {
        foreignKey: 'bank_id',
        as: 'bank',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      //Relation to User
      Infaq.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Infaq.init(
    {
      user_id: DataTypes.INTEGER,
      bank_id: DataTypes.INTEGER,
      periode_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      nominal: DataTypes.DOUBLE,
      waktu_pembayaran: DataTypes.DATE,
      bukti_pembayaran: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Infaq',
    }
  );
  return Infaq;
};

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
        foreignKey: 'periode_id',
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

      //Relation to Peserta
      Infaq.belongsTo(models.Peserta, {
        foreignKey: 'peserta_id',
        as: 'peserta',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      //Relation to Pengajar
      Infaq.belongsTo(models.Pengajar, {
        foreignKey: 'pengajar_id',
        as: 'pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Infaq.init(
    {
      peserta_id: DataTypes.INTEGER,
      pengajar_id: DataTypes.INTEGER,
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

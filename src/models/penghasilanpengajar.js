'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PenghasilanPengajar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Relation to Peserta
      PenghasilanPengajar.belongsTo(models.Peserta, {
        foreignKey: 'peserta_id',
        as: 'peserta',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      //Relation to Pengajar
      PenghasilanPengajar.belongsTo(models.Pengajar, {
        foreignKey: 'pengajar_id',
        as: 'pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      PenghasilanPengajar.belongsTo(models.Period, {
        foreignKey: 'periode_id',
        as: 'period',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  PenghasilanPengajar.init(
    {
      pengajar_id: DataTypes.INTEGER,
      peserta_id: DataTypes.INTEGER,
      pembayaran: DataTypes.DOUBLE,
      penghasilan: DataTypes.DOUBLE,
      periode_id: DataTypes.INTEGER,
      persentase_bagi_hasil: DataTypes.FLOAT,
      waktu_pembayaran: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'PenghasilanPengajar',
    }
  );
  return PenghasilanPengajar;
};

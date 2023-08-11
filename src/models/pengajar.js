'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pengajar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relation to User
      Pengajar.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Pengajar.init(
    {
      user_id: DataTypes.INTEGER,
      pendidikan_terakhir: DataTypes.STRING,
      punya_sertifikasi_guru_quran: DataTypes.INTEGER,
      background_pendidikan_quran: DataTypes.STRING,
      pengalaman_mengajar: DataTypes.STRING,
      pernah_mengajar_online: DataTypes.INTEGER,
      paham_aplikasi_meet: DataTypes.INTEGER,
      hafalan_quran: DataTypes.STRING,
      siap_komitmen: DataTypes.INTEGER,
      jam_mengajar: DataTypes.STRING,
      mengajar_hari_libur: DataTypes.INTEGER,
      bagi_hasil_50persen: DataTypes.INTEGER,
      isVerifiedByAdmin: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Pengajar',
    }
  );
  return Pengajar;
};

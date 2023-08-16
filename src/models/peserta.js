'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peserta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Peserta.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Peserta.init(
    {
      user_id: DataTypes.INTEGER,
      profesi: DataTypes.STRING,
      bisa_baca_ayat: {
        type: DataTypes.STRING,
        validate: {
          isIn: [
            [
              'Belum bisa membaca Quran',
              'Bisa membaca Quran tapi terbata-bata',
              'Bisa membaca Quran dengan lancar',
              'Bisa membaca dan sedang menghafal Quran',
            ],
          ],
        },
      },
      menguasai_ilmu_tajwid: {
        type: DataTypes.INTEGER,
        validate: { isIn: [[0, 1]] },
      },
      paham_aplikasi_meet: {
        type: DataTypes.INTEGER,
        validate: { isIn: [[0, 1]] },
      },
      siap_komitmen_mengaji: {
        type: DataTypes.INTEGER,
        validate: { isIn: [[0, 1]] },
      },
      siap_komitmen_infak: {
        type: DataTypes.INTEGER,
        validate: { isIn: [[0, 1]] },
      },
      bersedia_bayar_20K: {
        type: DataTypes.INTEGER,
        validate: { isIn: [[0, 1]] },
      },
    },
    {
      sequelize,
      tableName: 'Pesertas',
      modelName: 'Peserta',
    }
  );
  return Peserta;
};

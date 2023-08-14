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
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      pendidikan_terakhir: {
        type: DataTypes.STRING,
      },
      lembaga_pendidikan_terakhir: {
        type: DataTypes.STRING,
      },
      punya_sertifikasi_guru_quran: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      pengalaman_mengajar: {
        type: DataTypes.STRING,
      },
      pernah_mengajar_online: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      paham_aplikasi_meet: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      hafalan_quran: {
        type: DataTypes.STRING,
      },
      siap_komitmen: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      jam_mengajar: {
        type: DataTypes.STRING,
      },
      mengajar_hari_libur: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      bagi_hasil_50persen: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      isVerifiedByAdmin: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1]],
        },
      },
    },
    {
      sequelize,
      modelName: 'Pengajar',
    }
  );
  return Pengajar;
};

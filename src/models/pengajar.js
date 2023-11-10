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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Pengajar.hasMany(models.Infaq, {
        foreignKey: 'pengajar_id',
        as: 'infaq',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Pengajar.hasMany(models.JadwalMengajarPengajar, {
        foreignKey: 'pengajar_id',
        as: 'jadwal_mengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Pengajar.hasMany(models.Period, {
        foreignKey: 'pengajar_id',
        as: 'period',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Pengajar.hasMany(models.PenghasilanPengajar, {
        foreignKey: 'pengajar_id',
        as: 'penghasilan_pengajar',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Pengajar.init(
    {
      user_id: DataTypes.INTEGER,
      level: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['MUBTADI', 'YUKHTABAR', 'BARIE']],
        },
      },
      pendidikan_terakhir: DataTypes.STRING,
      punya_sertifikasi_guru_quran: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
      },
      pengalaman_mengajar: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['BELUM PERNAH', '< 6 BULAN', '> 6 BULAN']],
        },
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
      siap_komitmen: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: [[0, 1]],
        },
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
      link_video_membaca_quran: DataTypes.STRING,
      link_video_simulasi_mengajar: DataTypes.STRING,
      tanggal_wawancara: DataTypes.DATEONLY,
      jam_wawancara: DataTypes.TIME,
      link_wawancara: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'Pengajars',
      modelName: 'Pengajar',
    },
  );
  return Pengajar;
};

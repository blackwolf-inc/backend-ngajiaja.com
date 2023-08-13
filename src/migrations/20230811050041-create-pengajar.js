'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pengajars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pendidikan_terakhir: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      punya_sertifikasi_guru_quran: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      background_pendidikan_quran: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pengalaman_mengajar: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      pernah_mengajar_online: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      paham_aplikasi_meet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      hafalan_quran: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      siap_komitmen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      jam_mengajar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mengajar_hari_libur: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      bagi_hasil_50persen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      isVerifiedByAdmin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1]],
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pengajars');
  },
};

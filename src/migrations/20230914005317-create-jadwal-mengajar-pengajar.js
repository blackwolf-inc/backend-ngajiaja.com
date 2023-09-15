'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JadwalMengajarPengajars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pengajar_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pengajars',
          key: 'id',
        },
      },
      hari_mengajar: {
        type: Sequelize.STRING,
      },
      mulai_mengajar: {
        type: Sequelize.TIME,
      },
      selesai_mengajar: {
        type: Sequelize.TIME,
      },
      status_libur: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('JadwalMengajarPengajars');
  },
};

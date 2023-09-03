'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JadwalBimbinganPeserta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      peserta_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pesertas',
          key: 'id',
        },
      },
      hari_bimbingan_1: {
        type: Sequelize.STRING,
      },
      jam_bimbingan_1: {
        type: Sequelize.STRING,
      },
      hari_bimbingan_2: {
        type: Sequelize.STRING,
      },
      jam_bimbingan_2: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('JadwalBimbinganPeserta');
  },
};

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BimbinganTambahans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      period_id: {
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.STRING,
      },
      hari_bimbingan: {
        type: Sequelize.STRING,
      },
      jam_bimbingan: {
        type: Sequelize.STRING,
      },
      absensi_peserta: {
        type: Sequelize.INTEGER,
      },
      absensi_pengajar: {
        type: Sequelize.INTEGER,
      },
      catatan_pengajar: {
        type: Sequelize.TEXT,
      },
      keterangan_izin_peserta: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('BimbinganTambahans');
  },
};

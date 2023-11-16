'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('BimbinganTambahans', 'tanggal_baru', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('BimbinganTambahans', 'jam_baru', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('BimbinganTambahans', 'persetujuan_peserta', {
      type: Sequelize.INTEGER, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BimbinganTambahans', 'tanggal_baru');
    await queryInterface.removeColumn('BimbinganTambahans', 'jam_baru');
    await queryInterface.removeColumn('BimbinganTambahans', 'persetujuan_peserta');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Pengajars', 'nama_bank', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Pengajars', 'no_rekening', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
    await queryInterface.addColumn('Pengajars', 'nama_rekening', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pengajars', 'nama_bank');
    await queryInterface.removeColumn('Pengajars', 'no_rekening');
    await queryInterface.removeColumn('Pengajars', 'nama_rekening');
  },
};

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Pengajars', 'link_wawancara', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pengajars', 'link_wawancara');
  },
};

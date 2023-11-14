'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('BimbinganTambahans', 'link_meet', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BimbinganTambahans', 'link_meet');
  },
};

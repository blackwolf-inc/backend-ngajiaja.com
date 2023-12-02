'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('BimbinganRegulers', 'status', {
      type: Sequelize.STRING, // Tipe data kolom
      allowNull: true, // Opsional, sesuaikan sesuai kebutuhan
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BimbinganRegulers', 'status');
  },
};

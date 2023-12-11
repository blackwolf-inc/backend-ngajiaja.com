'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Pengajars', 'persentase_bagi_hasil', {
      type: Sequelize.FLOAT,
      defaultValue: 50,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pengajars', 'persentase_bagi_hasil');
  }
};
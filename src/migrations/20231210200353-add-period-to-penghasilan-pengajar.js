'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PenghasilanPengajars', 'periode_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Periods',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PenghasilanPengajars', 'periode_id');
  }
};
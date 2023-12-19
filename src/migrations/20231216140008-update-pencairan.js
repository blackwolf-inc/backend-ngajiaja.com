'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Pencairans', 'pengajar_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Pengajars', // name of the related model
        key: 'id', // field of Pengajars that Pencairans.pengajar_id refers to
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Pencairans', 'no_rekening', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('Pencairans', 'nama_rekening', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Pencairans', 'pengajar_id');

    await queryInterface.removeColumn('Pencairans', 'no_rekening', {
      type: Sequelize.INTEGER,
    });

    await queryInterface.removeColumn('Pencairan', 'nama_rekening', {
      type: Sequelize.INTEGER,
    });

  }
};

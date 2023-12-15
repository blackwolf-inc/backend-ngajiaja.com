'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuranAyat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_surat: {
        type: Sequelize.INTEGER,
        references: {
          model: 'QuranIndex', // name of your model
          key: 'id', // key in your model that we're referencing
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      no_ayat: {
        type: Sequelize.INTEGER
      },
      ayat: {
        type: Sequelize.TEXT('long')
      },
      terjemahan: {
        type: Sequelize.TEXT('long')
      },
      keterangan: {
        type: Sequelize.TEXT('long')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('QuranAyat');
  }
};
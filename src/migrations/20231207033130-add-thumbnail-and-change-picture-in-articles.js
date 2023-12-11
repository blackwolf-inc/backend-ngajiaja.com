'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Articles', 'article_thumbnail', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('Articles', 'article_picture', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Articles', 'article_thumbnail');
    await queryInterface.changeColumn('Articles', 'article_picture', {
      type: Sequelize.STRING,
    });
  }
};
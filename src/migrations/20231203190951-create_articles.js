'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Articles', {
      article_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_title: Sequelize.STRING,
      article_body: Sequelize.TEXT('long'),
      article_category: Sequelize.STRING,
      article_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ArticleCategories', // name of the ArticleCategory table
          key: 'categories_id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      article_picture: Sequelize.STRING,
      main_article: Sequelize.INTEGER,
      archived_article: Sequelize.INTEGER,
      article_createby: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Articles');
  }
};
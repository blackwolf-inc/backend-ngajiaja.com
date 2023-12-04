'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Article extends Model {
        static associate(models) {
            Article.belongsTo(models.ArticleCategories, {
                foreignKey: 'article_category_id',
                as: 'categories',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }
    Article.init(
        {
            article_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            article_title: DataTypes.STRING,
            article_body: DataTypes.TEXT('long'),
            article_category: DataTypes.STRING,
            article_category_id: DataTypes.INTEGER,
            article_picture: DataTypes.STRING,
            main_article: DataTypes.INTEGER,
            archived_article: DataTypes.INTEGER,
            article_createby: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Article',
        }
    )
    return Article
}
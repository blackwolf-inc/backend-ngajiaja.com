'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class ArticleCategories extends Model {
        static associate(models) {
            ArticleCategories.hasMany(models.Article, {
                foreignKey: 'categories',
                as: 'article_category',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })

            ArticleCategories.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }
    ArticleCategories.init(
        {
            categories_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            categories: DataTypes.STRING,
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            created_by: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'ArticleCategories',
        }
    )
    return ArticleCategories
}
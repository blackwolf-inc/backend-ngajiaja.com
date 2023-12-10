const { QueryTypes } = require('sequelize');
const db = require('../../../../models/index');
const { Article, ArticleCategories, User, sequelize } = db;
const jwt = require('jsonwebtoken');

class AdminArticle {
    async createArticleCategoryService(data, token) {
        const { categories } = data;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user_id = decodedToken.id;

        if (!user_id) {
            throw new Error('User id is null');
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const created_by = user.nama;
        const articleCategory = await ArticleCategories.create({ categories, created_by, user_id });

        return articleCategory;
    }

    async deleteArticleCategoryService(id) {
        const articleCategory = await ArticleCategories.findByPk(id);
        if (!articleCategory) {
            throw new Error('Article category not found');
        }

        await articleCategory.destroy();
        return articleCategory;
    }

    async createArticleService(data, token) {
        const { article_title, article_body, article_category_id, article_picture, main_article, archived_article } = data;

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user_id = decodedToken.id;

        const user = await User.findByPk(user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const category = await ArticleCategories.findByPk(article_category_id);
        if (!category) {
            throw new Error('Category not found');
        }

        const article_category = category.categories;
        const article_createby = user.nama;
        const article = await Article.create({
            article_title,
            article_body,
            article_category,
            article_category_id,
            article_picture,
            main_article,
            archived_article,
            article_createby
        });
        return article;

    }

}

module.exports = AdminArticle
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
        const { article_title, article_body, article_category_id, article_picture, main_article, archived_article, article_thumbnail } = data;

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
            article_createby,
            article_thumbnail
        });
        return article;

    }

    async updateArticleService(data, token, id) {
        const { article_title, article_body, article_category_id, article_picture, main_article, archived_article, article_thumbnail } = data;

        console.log('article_category_id:', article_category_id);

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user_id = decodedToken.id;

        const user = await User.findByPk(user_id);
        if (!user) {
            throw new Error('User not found');
        }

        const category = await ArticleCategories.findByPk(article_category_id);
        console.log('category:', category);

        if (!category) {
            throw new Error('Category not found');
        }

        const article_category = category.categories;
        const article_createby = user.nama;
        const article = await Article.findByPk(id, {
            include: [{
                model: ArticleCategories,
                as: 'categories_id',
                attributes: ['categories_id', 'categories', 'user_id', 'created_by', 'createdAt', 'updatedAt']
            }],
            attributes: ['article_id', 'article_title', 'article_body', 'article_category', 'article_category_id', 'article_picture', 'article_thumbnail', 'main_article', 'archived_article', 'article_createby', 'createdAt', 'updatedAt'] // specify the fields you want to select from the 'Articles' table
        });
        if (!article) {
            throw new Error('Article not found');
        }

        await article.update({
            article_title,
            article_body,
            article_category,
            article_category_id,
            article_picture,
            main_article,
            archived_article,
            article_createby,
            article_thumbnail,
        });
        return article;
    }

    async getArticleListService() {
        const article = await Article.findAll({
            include: [{
                model: ArticleCategories, // replace with your associated model
                as: 'categories' // replace with the alias you used in your association
            }]
        });
        return article;
    }


}

module.exports = AdminArticle
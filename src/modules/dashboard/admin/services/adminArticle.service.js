const { QueryTypes, Op, Sequelize } = require('sequelize');
const db = require('../../../../models/index');
const { Article, ArticleCategories, User, sequelize } = db;
const jwt = require('jsonwebtoken');
const { ceil } = Math;

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

    async getArticleListService(page = 1, pageSize = 10) {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;

        const totalArticles = await Article.count();

        const base_url = process.env.BASE_URL;

        const totalPages = ceil(totalArticles / pageSize);

        const articles = await Article.findAll({
            offset: offset,
            limit: pageSize,
            attributes: [
                'article_id',
                'article_title',
                'article_body',
                'article_category',
                'article_category_id',
                'article_picture',
                [Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail'],
                'main_article',
                'archived_article',
                'article_createby',
                'createdAt',
                'updatedAt'
            ]
        });

        return {
            data: articles,
            page,
            pageSize,
            totalPages
        };
    }

    async getArticleCategoryListService(page = 1, pageSize = 10) {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;

        const totalArticleCategories = await ArticleCategories.count();

        const totalPages = Math.ceil(totalArticleCategories / pageSize);

        const articleCategories = await ArticleCategories.findAll({
            offset: offset,
            limit: pageSize,
            attributes: [
                'categories_id',
                'categories',
                'user_id',
                'created_by',
                'createdAt',
                'updatedAt',
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM Articles AS a
                        WHERE a.article_category_id = ArticleCategories.categories_id
                    )`),
                    'jumlah_article',
                ],
            ],
        });

        return {
            data: articleCategories,
            page,
            pageSize,
            totalPages,
        };
    }

    async updateArticleCategoryService(data, categoriesId) {
        const categories = data;

        const articleCategory = await ArticleCategories.findByPk(categoriesId);
        if (!articleCategory) {
            console.error(`Article category not found for id: ${categoriesId}`);
            throw new Error('Article category not found');
        }

        await articleCategory.update({ categories: categories });

        return articleCategory;
    }


}

module.exports = AdminArticle
const db = require('../../.../../../models/index');
const { Article, ArticleCategories, sequelize } = db;
const { QueryTypes, Op, Sequelize } = require('sequelize');

class ArticleService {
    async getArticlePostService(page = 1, pageSize = 10) {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;
        const base_url = process.env.BASE_URL;

        const totalArticles = await Article.count({
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            },
            where: {
                archived_article: 0
            }
        });
        const totalPages = Math.ceil(totalArticles / pageSize);

        const articles = await Article.findAll({
            offset: offset,
            limit: pageSize,
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            },
            where: {
                archived_article: 0
            }
        });

        return { articles, page, pageSize, totalPages };
    }

    async getArticleMainService(page = 1, pageSize = 10, article_title = '', article_category = '') {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;
        const base_url = process.env.BASE_URL;

        const totalArticles = await Article.count({
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            },
            where: {
                main_article: 1,
                archived_article: 0,
                article_title: {
                    [Op.like]: `%${article_title}%`
                },
                article_category: {
                    [Op.like]: `%${article_category}%`
                }
            }
        });
        const totalPages = Math.ceil(totalArticles / pageSize);

        const articles = await Article.findAll({
            offset: offset,
            limit: pageSize,
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            },
            where: {
                main_article: 1,
                archived_article: 0,
                article_title: {
                    [Op.like]: `%${article_title}%`
                },
                article_category: {
                    [Op.like]: `%${article_category}%`
                }
            }
        });

        return { articles, page, pageSize, totalPages };
    }

    async getArticleArcivedService(page = 1, pageSize = 10, article_title = '', article_category = '') {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;
        const base_url = process.env.BASE_URL;

        const totalArticles = await Article.count({
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            },
            where: {
                archived_article: 1,
                article_title: {
                    [Op.like]: `%${article_title}%`
                },
                article_category: {
                    [Op.like]: `%${article_category}%`
                }
            }
        });
        const totalPages = Math.ceil(totalArticles / pageSize);

        const articles = await Article.findAll({
            offset: offset,
            limit: pageSize,
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            }, where: {
                archived_article: 1,
                article_title: {
                    [Op.like]: `%${article_title}%`
                },
                article_category: {
                    [Op.like]: `%${article_category}%`
                }
            }
        });

        return { articles, page, pageSize, totalPages };
    }

    async getArticleByIdService(article_id) {
        const base_url = process.env.BASE_URL;

        const article = await Article.findOne({
            attributes: {
                exclude: ['categories'],
                include: [[Sequelize.literal(`CONCAT('${base_url}/images/', article_thumbnail)`), 'article_thumbnail']]
            },
            where: {
                article_id: article_id
            }
        });

        if (article) {
            await Article.increment('article_views', { where: { article_id: article_id } });
        }

        return article;
    }

    async getArticleCategoryService(page = 1, pageSize = 10, categories = '') {
        page = Number(page);
        pageSize = Number(pageSize);
        const offset = (page - 1) * pageSize;

        const totalArticleCategories = await ArticleCategories.count({
            where: {
                categories: {
                    [Op.like]: `%${categories}%`
                }
            }
        });

        const totalPages = Math.ceil(totalArticleCategories / pageSize);

        const articleCategories = await ArticleCategories.findAll({
            where: {
                categories: {
                    [Op.like]: `%${categories}%`
                }
            },
            offset: offset,
            limit: pageSize
        });

        return { articleCategories, page, pageSize, totalPages };
    }
}

module.exports = ArticleService
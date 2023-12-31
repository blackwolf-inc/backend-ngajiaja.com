const ArticleService = require('../services/article.service')
const responseHandler = require('../../../helpers/responseHandler');

class ArticlePost {
    static async getArticlePost(req, res, next) {
        const service = new ArticleService()
        try {
            const { page, pageSize, article_title, article_category } = req.query
            const articleIndex = await service.getArticlePostService(page, pageSize, article_title, article_category)
            return responseHandler.succes(res, 'Article Index', articleIndex);
        } catch (error) {
            next(error);
        }
    }

    static async getArticleMain(req, res, next) {
        const service = new ArticleService()
        try {
            const { page, pageSize, article_title, article_category } = req.query
            const articleMain = await service.getArticleMainService(page, pageSize, article_title, article_category)
            return responseHandler.succes(res, 'Article Main', articleMain);
        } catch (error) {
            next(error);
        }
    }

    static async getArticleArchived(req, res, next) {
        const service = new ArticleService()
        try {
            const { page, pageSize, article_title, article_category } = req.query
            const articleArchived = await service.getArticleArcivedService(page, pageSize, article_title, article_category)
            return responseHandler.succes(res, 'Article Archived', articleArchived);
        } catch (error) {
            next(error);
        }
    }

    static async getArticleDetail(req, res, next) {
        const service = new ArticleService()
        try {
            const articleDetail = await service.getArticleByIdService(req.params.id)
            return responseHandler.succes(res, 'Article Detail', articleDetail);
        } catch (error) {
            next(error);
        }
    }

    static async getArticleCategory(req, res, next) {
        const service = new ArticleService()
        try {
            const { page, pageSize, categories } = req.query
            const articleCategory = await service.getArticleCategoryService(page, pageSize, categories)
            return responseHandler.succes(res, 'Article Category', articleCategory);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ArticlePost
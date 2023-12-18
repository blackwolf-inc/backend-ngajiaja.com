const ArticleService = require('../services/article.service')
const responseHandler = require('../../../helpers/responseHandler');

class ArticlePost {
    static async getArticlePost(req, res, next) {
        const service = new ArticleService()
        try {
            const articleIndex = await service.getArticlePostService()
            return responseHandler.succes(res, 'Article Index', articleIndex);
        } catch (error) {
            next(error);
        }
    }

    static async getArticleMain(req, res, next) {
        const service = new ArticleService()
        try {
            const articleMain = await service.getArticleMainService()
            return responseHandler.succes(res, 'Article Main', articleMain);
        } catch (error) {
            next(error);
        }
    }

    static async getArticleArchived(req, res, next) {
        const service = new ArticleService()
        try {
            const articleArchived = await service.getArticleArcivedService()
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
}

module.exports = ArticlePost
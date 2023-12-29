const { Router } = require('express');
const router = Router();
const ArticleController = require('./controllers/article.controllers')

router.get('/test', (req, res) => {
    res.send('test article');
});

router.get('/index', ArticleController.getArticlePost)
router.get('/main', ArticleController.getArticleMain)
router.get('/archived', ArticleController.getArticleArchived)
router.get('/detail/:id', ArticleController.getArticleDetail)
router.get('/category', ArticleController.getArticleCategory)

module.exports = router
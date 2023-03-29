const express = require('express')
const router = express.Router();
const ArticleController = require('../controllers/article')

// Routes test
router.get('/proof-test', ArticleController.test)
router.get('/course', ArticleController.course)

// Route useful
router.get('/articles/:limit?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.one);

router.post('/create', ArticleController.create);
router.post('/upload-image/:id', ArticleController.upload);

router.delete('/article/:id', ArticleController.eliminate);

router.put('/article/:id', ArticleController.update);




module.exports = router;
const express = require('express')
const multer = require('multer')
const router = express.Router();
const ArticleController = require('../controllers/article')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/articles/');
    },

    filename: function (req, file, cb) {
        cb(null, 'article' + Date.now() + file.originalname);
    }
})

const updates = multer({storage: storage});

// Routes test
router.get('/proof-test', ArticleController.test)
router.get('/course', ArticleController.course)

// Route useful
router.get('/articles/:limit?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.one);
router.get('/image/:ficher', ArticleController.image);
router.get('/search/:search', ArticleController.search);

router.post('/create', ArticleController.create);
router.post('/upload-image/:id', [updates.single('file')],ArticleController.upload);

router.delete('/article/:id', ArticleController.eliminate);

router.put('/article/:id', ArticleController.update);




module.exports = router; 
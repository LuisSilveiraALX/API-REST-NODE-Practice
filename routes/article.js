const express = require('express')
const router = express.Router();

const ArticleController = require('../controllers/article')

// Routes test
router.get('/proof-test', ArticleController.test)
router.get('/course', ArticleController.course)

// Route useful

router.post('/create', ArticleController.create);




module.exports = router;
const fs = require('fs');
const path = require('path');
const { validateArticle } = require('../helper/validate')
const Article = require('../models/Article')

const test = (req, res) => {
  return res.status(200).json({
    mensaje: "test"
  })
}

const course = (request, response) => {

  console.log('Ejecute endpoint test')
  return response.status(200).send({
    autor: "Luis Silveira"
  });
};

const create = async (req, res) => {

  // Collect parameters by post method to save
  let params = req.body;

  // Validate data
  try {
    validateArticle(params);

  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing data to send'
    })
  }
  // Create objet to save
  const article = new Article(params)

  // Assign values to objects based on the model
  //article.title = params.title;

  // Save the articule in the database
  await article
    .save()
    .then((articleSave) => {
      // Return result
      return res.status(200).json({
        status: "Success",
        articulo: articleSave,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        status: "Error",
        mensaje: "Article not saved",
      });
    });
}

const getArticles = async (req, res) => {
  try {
    let articles = Article.find({}).sort({ date: -1 })

    if (req.params.limit) {
      articles.limit(3);
    }

    articles = await articles.exec();

    if (!articles) {
      return res.status(404).json({
        status: "error",
        message: "Items not found",
      });
    }

    return res.status(200).json({
      status: "success",
      counter: articles.length,
      articles,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const one = async (req, res) => {
  try {
    // Collect id by the url
    let id = req.params.id;
    // look for the article
    const article = await Article.findById(id);
    // If it doesn't existe, return error
    if (!article) {
      return res.status(404).json({
        status: "error",
        message: "item not found",
      });
    }
    // if it exists, return result
    return res.status(200).json({
      status: 'success',
      article
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}

const eliminate = async (req, res) => {
  try {
    let articleId = req.params.id;

    const article = await Article.findOneAndDelete({ _id: articleId })

    if (!article) {
      return res.status(404).json({
        status: "error",
        message: "Error deleting article"
      })
    }

    return res.status(200).json({
      status: 'success',
      article
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}


const update = async (req, res) => {

  let articleId = req.params.id

  let params = req.body

  // validate data
  try {
    validateArticle(params);

  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing data to send'
    })
  }

  try {
    const articleUpdate = await Article.findByIdAndUpdate(articleId, req.body, { new: true });


    if (!articleUpdate) {
      return res.status(404).json({
        status: "error",
        message: "Error article update"
      })
    }

    return res.status(200).json({
      status: 'success',
      article: articleUpdate
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'server error',
    });
  }
}

const upload = (req, res) => {

  // config librare multer

  // pick up the image file
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      message: "invalid request"
    })
  }
  // name file
  let archive = req.file.originalname;

  // file extension
  let archive_split = archive.split('\.');
  let extension = archive_split[1];

  // check the extension
  if (extension != "png" && extension != "jpg" &&
    extension != "jpeg" && extension != "gif") {

    // delete archive and response
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        message: "image invalidate"
      })
    })
  } else {
    let articleId = req.params.id

    const articleUpdate = async () => {
      try {
        const updatedArticle = await Article.findByIdAndUpdate(articleId, { image: req.file.filename }, { new: true });

        if (!updatedArticle) {
          return res.status(404).json({
            status: "error",
            message: "Error article update"
          });
        }

        return res.status(200).json({
          status: "success",
          article: updatedArticle,
          ficher: req.file
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Server error",
        });
      }
    }

    articleUpdate();
  }
}


const image = (req, res) => {
  let ficher = req.params.ficher;
  let ruta = path.resolve(`./images/articles/${ficher}`);

  fs.stat(ruta, (error, exists) => {
    if (exists) {
      return res.sendFile(ruta);
    } else {
      return res.status(404).json({
        status: "error",
        message: "Image doesn't exist"
      });
    }
  });
};

const search = async (req, res) => {

 try {
  let search = req.params.search;

  const articleSearch = await Article.find({ 
    '$or': [
      {'title': { '$regex': search, '$options': 'i'}},
      {'content': { '$regex': search, '$options': 'i'}},
  ]})
  .sort({date: -1})
  .exec();

    if (!articleSearch || articleSearch.length <= 0) {
      return res.status(404).json({
        status:'error',
        message:'No articles found'
      });
    }

    return res.status(200).json({
      status:'success',
      article: articleSearch
    })
  
 } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
 }
}

module.exports = {
  test,
  course,
  create,
  getArticles,
  one,
  eliminate,
  update,
  upload,
  image,
  search
}
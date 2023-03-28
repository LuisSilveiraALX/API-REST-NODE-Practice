const validator = require('validator');
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

        let validate_title = !validator.isEmpty(params.title) && 
        validator.isLength(params.title, {min: 5, max: undefined});
        let validate_content = !validator.isEmpty(params.content);

        if(!validate_title || ! validate_content) {
            throw new Error('The information has not been validated!');
        }

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
      if(!article) {
        return res.status(404).json({
          status:"error",
          message:"item not found",
        });
      }
      // if it exists, return result
      return res.status(200).json({
        status:'success',
        article
      })
    } catch (error) {
      return res.status(500).json({
        status:'error',
        message:error.message,
      });
    }
  }

  const eliminate = async (req, res) => {
    try {
      let articleId = req.params.id;

      const article = await Article.findOneAndDelete({_id: articleId})

      if (!article) {
        return res.status(404).json({
          status:"error",
          message:"Error deleting article"
        })
      }

      return res.status(200).json({
        status:'success',
        article
      })

    } catch (error) {
      return res.status(500).json({
        status:'error',
        message:error.message,
      });
    }
  }

  const update = async (req, res) => {
    
      let articleId = req.params.id

      let params = req.body

      try {

        let validate_title = !validator.isEmpty(params.title) && 
        validator.isLength(params.title, {min: 5, max: undefined});
        let validate_content = !validator.isEmpty(params.content);

        if(!validate_title || ! validate_content) {
            throw new Error('The information has not been validated!');
        }

    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing data to send'
        })
    }

    try {
      const articleUpdate = await Article.findByIdAndUpdate(articleId, req.body, {new: true});
      

      if (!articleUpdate) {
        return res.status(404).json({
          status:"error",
          message:"Error article update"
        })
      }

      return res.status(200).json({
        status:'success',
        article: articleUpdate
      })
    } catch (error) {
      return res.status(500).json({
        status:'error',
        message:'server error',
      });
    }
  }

module.exports = {
    test,
    course,
    create,
    getArticles,
    one,
    eliminate,
    update
}
const express = require('express');
const app = express();
const axios = require('axios');
const RecipeData = require('./RecipeData');
const path = require('path'); //heroku

const port = process.env.PORT || 5000;

// heroku
if (process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));
  app.get('/', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// fetch data when search for recipe from Recipe Puppy API
app.get('/getrecipe', (req, res) => {

  const dish = req.query.dish;
  const ingredients = req.query.ingredients;
  const status = req.query.status;
  const querystr = `http://www.recipepuppy.com/api/?i=${ingredients}&q=${dish}`;

  const randomNum = Math.floor((Math.random() * 10));

  axios
    .get(querystr)
    .then(response => {
      const recipeData = new RecipeData({
        title: response.data.results[randomNum].title,
        href: response.data.results[randomNum].href,
        ingredients: response.data.results[randomNum].ingredients,
        thumbnail: response.data.results[randomNum].thumbnail,
        dish: dish,
        ingredientsSearch: ingredients,
        status: status
      });
      if (!recipeData.title) {
        res.status(200).json('Not found');
        return;
      }
      recipeData
        .save()
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(400).json(error);
        });
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

// get all recipes data from database
app.get('/getallrecipes', (req, res) => {
  RecipeData.find({})
    .sort([['_id', -1]])
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

// delete recipe by id from database
app.get('/deleterecipe', (req, res) => {
  RecipeData.deleteMany({ _id: req.query.id })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

// delete all recipe from database
app.get('/deleteall', (req, res) => {
  RecipeData.deleteMany({ })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(400).json(error);
    });
});

// edit and update the status of the recipe in database
app.get('/editstatus', (req,res) => {
  const find = {_id: req.query.id};
  const newStatus = { $set: {status: req.query.status}};

  RecipeData.findOneAndUpdate(find, newStatus)
    .then(response => {
      res.status(200).json(response);
      
    })
    .catch(error => {
      res.status(400).json(error);
    })
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

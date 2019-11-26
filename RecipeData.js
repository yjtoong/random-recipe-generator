const mongoose = require('mongoose');
const db = "mongodb+srv://yjtoong:test@cluster0-csnaf.mongodb.net/recipe_database?retryWrites=true&w=majority";
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useFindAndModify: false }
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log('Mongoose connection error: ', error);
  });

const schema = mongoose.Schema({
  title: { type: String },
  href: { type: String },
  ingredients: { type: String },
  thumbnail: { type: String },
  dish: { type: String },
  ingredientsSearch: { type: String },
  status: { type: String }
});

const RecipeData = mongoose.model('Recipes', schema, 'recipes');

module.exports = RecipeData;
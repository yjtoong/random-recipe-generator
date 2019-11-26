import React from 'react';
import RRGlogo from './RRGlogo3.png';

const Recipes = props => (
  <div className="container">
    <div className="row">
    { props.recipes.map((recipe) => {
      return (
        <div key={recipe._id} className="col-md-4" style={{ marginBottom:"2rem" }}>
          <div className="recipes__box">
            <img 
              className="recipe__box-img" 
              src={recipe.thumbnail === '' ? RRGlogo : recipe.thumbnail} 
              alt={recipe.title}/>
              <div className="recipe__text">
                <h5 className="recipes__title">
                  { recipe.title.length < 20 ? `${recipe.title}` : `${recipe.title.substring(0, 25)}...` } {/* cut the title that are too long to beautify the UI */}
                </h5>
                <p className="recipes__subtitle">Ingredients: <span>
                  { recipe.ingredients.length < 30 ? `${recipe.ingredients}` : `${recipe.ingredients.substring(0, 30)}...` } {/* cut the ingredients that are too long to beautify the UI */}
                </span></p>
              </div>
              <form onSubmit={(e)=>{props.editData(e, recipe)}}>
                <label className="dropdown__label">
                  Status: 
                  <select className="dropdown__selection" value={recipe.status} onChange={props.handleChange} >
                    <option value="none">None</option>
                    <option value="interested">Interested</option>
                    <option value="cooking">Cooking</option>
                    <option value="cooked">Cooked</option>
                  </select>
                </label>
                <input type="submit" value="Update" className="dropdown__button"/>
              </form>
              <a href={recipe.href}><button className="recipe_buttons" >View Recipe</button></a>
              <button className="recipe_buttons" onClick={() => {props.getRecipeNutrients(recipe)}} >View Nutrients</button>
              <button className= "recipe_delete" onClick={() => {props.removeRecipe(recipe._id)}}>Dismiss</button>
          </div>
        </div>
      );
    })}
    </div>
  </div>
);

export default Recipes;
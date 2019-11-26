import React, { Component } from 'react';
import './App.css';
import Recipes from "./components/Recipes";
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';

const axios = require('axios');

class App extends Component {
  constructor() {
    super();
    this.state = {
      dish: '',
      ingredients: '',
      recipes: [],
      modalIsOpen: false,
      nutrients1: '',
      nutrients2: '',
      nutrients3: '',
      nutrients4: '',
      status: 'none'
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.getAllRecipes(); //get all recipes in database when the website loaded
  }

  // get all recipes
  getAllRecipes = () => {
    axios
      .get('/getallrecipes')
      .then(result => {
        this.setState({ recipes: result.data});
      })
      .catch(error => {
        alert('Error: ',error);
      });
  };

  // get single recipe ingredients and pass into Edamam API to fetch nutrients data
  getRecipeNutrients = (recipe) => {
    const app_id='5d7b50e7';
    const app_key='2b78c3001041e095da323d694b100033';
    const ingr = recipe.ingredients;
    const ingrSplit = ingr.split(", "); // split and convert a string of ingredients into a list
    var ingrStr = '';
    for (var i = 0; i < ingrSplit.length; i++){ //convert the list of ingredients in to a string with specified format for encoding
      if (i === 0){
        ingrStr += '1 ';
        ingrStr += ingrSplit[i];
      }
      else{
        ingrStr += ' AND 1 ';
        ingrStr += ingrSplit[i];
      }
    }

    const ingrEncode = encodeURIComponent(ingrStr); //encode the string to pass into API

    axios.get(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&ingr=${ingrEncode}`)
    .then((response) => {
      let nutrients1 = response.data.totalNutrientsKCal.CHOCDF_KCAL.label + ': ' + response.data.totalNutrientsKCal.CHOCDF_KCAL.quantity + ' ' + 
      response.data.totalNutrientsKCal.CHOCDF_KCAL.unit;
      
      let nutrients2 = response.data.totalNutrientsKCal.ENERC_KCAL.label + ': ' + response.data.totalNutrientsKCal.ENERC_KCAL.quantity + ' ' + 
      response.data.totalNutrientsKCal.ENERC_KCAL.unit;
      
      let nutrients3 = response.data.totalNutrientsKCal.FAT_KCAL.label + ': ' + response.data.totalNutrientsKCal.FAT_KCAL.quantity + ' ' + 
      response.data.totalNutrientsKCal.FAT_KCAL.unit;
      
      let nutrients4 = response.data.totalNutrientsKCal.PROCNT_KCAL.label + ': ' + response.data.totalNutrientsKCal.PROCNT_KCAL.quantity + ' ' + 
      response.data.totalNutrientsKCal.PROCNT_KCAL.unit;
      
      this.setState({
        nutrients1,
        nutrients2,
        nutrients3,
        nutrients4
      })

      this.toggleModal(); //display the nutrients data in a Modal (pop-up)

    })
    .catch(() => {
      alert('No nutrients data');
    });
  };

  //toggle the modal to display nutrients
  toggleModal(){
    this.setState({
      modalIsOpen: !this.state.modalIsOpen
    })
  }

  //for form
  onSubmit = e => {
    e.preventDefault(); //prevent the page from refreshing with submit the input
    let status = 'none';
    if (this.state.dish === '' && this.state.ingredients === '') { // error handling when no input
      alert('Please enter either dish or ingredient');
    }
    else{
      const query = `/getrecipe?ingredients=${this.state.ingredients}&dish=${this.state.dish}&status=${status}`;

      axios
        .get(query)
        .then(() => {
          this.getAllRecipes(); //update the website
        })
        .catch(() => {
          alert('Recipe not found');
        });
    }
  };

  // for form field
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // delete the recipe from database by id
  removeRecipe = (id) => {
    this.setState({
      recipes: this.state.recipes.filter(recipe => {
        if (recipe._id !== id) return recipe;
      })
    });
    const query = `/deleterecipe?id=${id}`;
    axios
      .get(query)
      .then(() => {
        this.getAllRecipes(); //update the website
      })
      .catch(error => {
        alert('Error: ',error);
      });
  }

  //delete all the recipes from database
  removeAll = () => {
    const query = `/deleteall`;
    axios
      .get(query)
      .then(() => {
        this.getAllRecipes(); //update the website
      })
      .catch(error => {
        alert('Error: ',error);
      });
  }

  //edit the status of the recipe in the database
  editData = (e, recipe) => {
    e.preventDefault();
    let status = this.state.status;
    let id = recipe._id;
    const query = `/editstatus?id=${id}&status=${status}`;
    axios
      .get(query)
      .then(()=> {
        this.getAllRecipes(); //update the website
      })
      .catch(error => {
        alert('Error: ',error);
      })
  }

  //handle change and set the status of the recipe
  handleChange = (event) => {
    this.setState({status: event.target.value});
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Random Recipe Generator</h1>
        </header>
        <form onSubmit={this.onSubmit} style={{ marginBottom:"2rem" }}>
          <label className="form__subtitle">Filter by:</label>
          <input className="form__input" type="text" name="dish" placeholder="Dish: omelet" onChange={this.onChange} />
          <input className="form__input" type="text" name="ingredients" placeholder="Ingredients: garlic, onion ..." onChange={this.onChange} />
          <button className="form__button">Search</button>
        </form>
        <Recipes 
        recipes={this.state.recipes} 
        onSubmitWiki = {this.onSubmitWiki} 
        removeRecipe={this.removeRecipe} 
        getRecipeNutrients={this.getRecipeNutrients} 
        editData={this.editData} 
        status={this.state.status}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
         />
        {this.state.recipes.length !== 0 ? <button className="form__dataremove" onClick={this.removeAll}>Remove All</button> : ''}
        <Modal isOpen={this.state.modalIsOpen}>
        <ModalHeader toggle={this.toggleModal.bind(this)} >Nutrients</ModalHeader>
          <ModalBody>{this.state.nutrients1}</ModalBody>
          <ModalBody>{this.state.nutrients2}</ModalBody>
          <ModalBody>{this.state.nutrients3}</ModalBody>
          <ModalBody>{this.state.nutrients4}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        
      </div>
    )}}

export default App;

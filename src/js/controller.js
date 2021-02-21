//Import everything from model
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    //Get the hash from the browser URL
    const id = window.location.hash.slice(1);
    if (!id) return;
    //Start a spinner that waits until the recipe load
    recipeView.renderSpinner();

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering recipe from the state
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load search results
    await model.loadSearchResults(query);
    //3. Render results
    console.log(model.state.search.results);
  } catch (err) {
    recipeView.renderError();
    console.error(`${err} 💥💥💥💥💥`);
  }
};

/////////////      START APPLICATION   /////////////////////
// SUBSCRIBER/PUBLISHER pattern to call Events in the view
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();

//Import everything from model
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

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
    resultsView.renderSpinner();
    //1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. Load search results
    await model.loadSearchResults(query);
    //3. Render results
    resultsView.render(model.state.search.results);
  } catch (err) {
    recipeView.renderError(model.state.search.results);
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

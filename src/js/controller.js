//Import everything from model
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

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
    resultsView.render(model.getSearchResultsPage(1));
    //4. Render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
  }
};

const controlPagination = function (goToPage) {
  //1. Render NEW page with results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //2. Render initial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  //Rendering recipe from the state
  recipeView.render(model.state.recipe);
};

/////////////      START APPLICATION   /////////////////////
// SUBSCRIBER/PUBLISHER pattern to call Events in the view
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerButtons(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
};

init();

//Import everything from model
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import previewView from './views/previewView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './views/View.js';

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
    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering recipe from the state
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();

    console.error(err);
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
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. ADD/REMOVE bookmark
  //If not bookmarked, set bookmarked=true
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //Delete bookmarked passing the id
  else model.deleteBookmark(model.state.recipe.id);
  //2. UPDATE recipe view
  recipeView.update(model.state.recipe);
  //3. Render bookmarks

  bookmarksView.render(model.state.bookmarks);
};

//Render bookmarks when app starts
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //Render recipe
    recipeView.render(model.state.recipe);
    //Success message
    addRecipeView.renderMessage();
    //Render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL without reloading the page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};
/////////////      START APPLICATION   /////////////////////
// SUBSCRIBER/PUBLISHER pattern to call Events in the view
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPageButtons(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

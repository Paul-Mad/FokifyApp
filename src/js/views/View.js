import icons from 'url:../../img/icons.svg'; // Parcel 2

//Export the actual class, not and instance of the class
export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered (e.g recipe)
   * @param {boolean} [render= true] If false, create markup string instead of rendering to th DOM
   * @returns {undefined | string} A markup is returned if render=false
   * @this {Object} View instance
   * @author Paulo Madeira
   * @todo Finish implementation
   */
  render(data, render = true) {
    //Check if data id valid or an empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //Set #data from the recipe state
    this._data = data;
    //Get the recipe html code
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Updates only changed data in the DOM
  update(data) {
    //Set #data from the recipe state
    this._data = data;
    //Get the recipe html code
    const newMarkup = this._generateMarkup();

    //convert the string to a new DOM object in the memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      //Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  //Clear element data
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //"message = this._errorMessage" means default value for message in case the parameter is empty
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
      <p>${message}</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

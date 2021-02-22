import View from './View.js';

import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerButtons(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // Identify different scenarios to render the pages
    // Page 1, and there are other pages

    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(currentPage, 'next');
    }
    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(currentPage, 'prev');
    }
    //Other page
    if (currentPage < numPages) {
      return `${this._generateMarkupButton(currentPage, 'prev')}
                ${this._generateMarkupButton(currentPage, 'next')}
                `;
    }
    // Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupButton(currentPage, direction) {
    if (direction === 'next')
      return `
            <button data-goto="${
              currentPage + 1
            }" class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;

    if (direction === 'prev')
      return `
            <button data-goto="${
              currentPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>`;
  }
}

export default new PaginationView();

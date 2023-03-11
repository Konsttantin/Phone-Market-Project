'use strict'

const filters = document.querySelector('.filters');
const sortOptions = document.querySelector('.sort-options');
const productHeart = document.querySelector('.product-card__icon');
let currentSortOption = document.getElementById('default');

filters.addEventListener('click', (e) => {
  const description = e.target.closest('.filter__description');

  if (description) {
    description.classList.toggle('active');
  }
});

sortOptions.addEventListener('click', (e) => {
  const sortOption = e.target.closest('.sort-options__item');

  if (sortOption) {
    currentSortOption.classList.remove('active');
    sortOption.classList.toggle('active');

    currentSortOption = sortOption;
  }
});

productHeart.addEventListener('click', (e) => {
  if (e.target.closest('.product-card__icon')) {
    productHeart.classList.toggle('active');
  }
});

'use strict'

import { initialProducts } from "./initialProducts.js";

import { initializePage } from "./features/initializePage.js";
import { renderProducts } from "./features/renderProducts.js";
import { filterOptions } from "./features/filterOptions.js";
import { basketActions } from "./features/basketActions.js";
import { wishlistActions } from "./features/wishlistActions.js";
import { sortProducts } from "./features/sortProducts.js";
import { searchProduct } from "./features/searchProduct.js";
import { storage } from "./features/storage.js";

export const appElements = {
  products: document.querySelector('.products'),
  basket: document.querySelector('.basket'),
  filters: document.querySelector('.filters'),
  filtersButton: document.querySelector('.filters-button'),
  sortOptions: document.querySelector('.sort-options'),
  sortOptionsMob: document.querySelector('.sort-options--mobile'),
  pagination: document.querySelector('.main__pagination'),
  searchBar: document.querySelector('.header__field'),
  wishlistIcon: document.querySelector('.header__icon--heart'),
  logo: document.querySelector('.header__logo'),
}; // all used application elements

export const currentAppState = { 
  products: [...initialProducts],
  showFavorites: false,
  currentSortOption: document.getElementById('default'), // stores state of sort buttons
  renderLimit: 8, // limit the count of products rendered

  setProductsCount() {
    const counter = document.querySelector('.goods-counter');
    const productsCount = String(currentAppState.products.length);
  
    const wordEndings = {
      'товаров': ['11', '12', '13', '14', '5', '6', '7', '8', '9', '0'],
      'товара': ['2', '3', '4'],
      'товар': ['1']
    };
  
    for (const ending in wordEndings) {
      if (wordEndings[ending].some(end => productsCount.endsWith(end))) {
        counter.innerHTML=`${productsCount} ${ending}`;
  
        return;
      }
    }
  }, // set count of current products

  updatePagination() {
    appElements.pagination.classList.toggle('active', currentAppState.renderLimit < currentAppState.products.length);
  }, // update pagination button state
}; // contains actual state of the whole application

initializePage();

// ---------- PRODUCTS ----------

appElements.products.addEventListener('click', (e) => {
  e.preventDefault();

  const productCard = e.target.closest('.product-card');
  const heart = e.target.closest('.product-card__icon');
  const buyButton = e.target.closest('.product-card__button');

  if (heart) {
    const InWishlist = storage.getStorageCell('wishlist')
      .some(prod => prod.id === productCard.id);

    InWishlist
      ? storage.removeFromStorageCell(productCard.id, 'wishlist')
      : storage.addToStorageCell(productCard.id, 'wishlist', false)

    wishlistActions.setWishlistCounter();
    return;
  }

  if (buyButton && !buyButton?.classList.contains('in-basket')) {
    storage.addToStorageCell(productCard.id, 'basket', true);
  }
}); // handling events on product cards

appElements.pagination.addEventListener('click', (e) => {
  if (!e.target.closest('.main__pagination-button')) {
    return;
  }

  if (currentAppState.renderLimit < currentAppState.products.length) {
    currentAppState.renderLimit += 8;
  }

  renderProducts();
}); // handle pagination button (increase render limit)

// ---------- FILTERING ----------

appElements.filters.addEventListener('input', (e) => {
  const filter = e.target.closest('.filter__content');
  const input = e.target;

  if (!filter) {
    return;
  }

  filterOptions.setOptions(input, filter.dataset.option);
}); // handle filter input

appElements.filters.addEventListener('click', (e) => {
  const description = e.target.closest('.filter__description');

  if (description) {
    description.classList.toggle('active');
  }
}); // open/close filters

// ---------- SORTING ----------

appElements.sortOptions.addEventListener('click', (e) => {
  const sortOption = e.target.closest('.sort-options__item');

  if (sortOption) {
    currentAppState.currentSortOption.classList.remove('active');
    sortOption.classList.toggle('active');

    currentAppState.currentSortOption = sortOption;

    sortProducts(sortOption.dataset.option, sortOption.id === 'price-asc');
  }
}); // handle sort buttons

// ---------- SEARCHING ----------

appElements.searchBar.addEventListener('input', searchProduct); // handle input from searchbar

// ---------- BASKET ----------

document.body.addEventListener('click', basketActions.handleState); // handle state of basket in different scenarios

appElements.basket.addEventListener('click', (e) => {
  const basketItem = e.target.closest('.basket__item');
  const clear = e.target.closest('.basket__clear');
  const counter = e.target.closest('.basket__item-counter');
  const deleteBtn = e.target.closest('.basket__item-delete');

  if (clear) {
    storage.clearStorageCell('basket');
  }

  if (deleteBtn) {
    storage.removeFromStorageCell(basketItem.id, 'basket');
  }

  if (counter) {
    basketActions.changeCount(basketItem, e);
  }
}); // handle different clicks in basket area

appElements.basket.addEventListener('mouseover', (e) => {
  const clear = document.querySelector('.basket__clear');

  clear.classList.toggle('active', e.target === clear);
}); // animate trash bin in basket

// ---------- WISHLIST ----------

appElements.wishlistIcon.addEventListener('click', (e) => {
  if (appElements.wishlistIcon.classList.contains('active')) {
    currentAppState.showFavorites = true;

    renderProducts();
  }
}); // show only favorite products

appElements.logo.addEventListener('click', (e) => {
  if (currentAppState.showFavorites) {
    currentAppState.showFavorites = false;

    renderProducts();
  }
}); // get back to all products by click to logo

// ---------- RICKROLLLLLL ----------

const magicButton = document.querySelector('.basket__order-button');

magicButton.addEventListener('click', () => {
  document.body.innerHTML = `
    <div class="rickroll">
      <video src="./video/Rick Astley - Never Gonna Give You Up (Official Music Video).mp4" preload="auto" autoplay></video>
    </div>
  `;

  document.body.requestFullscreen();
});

// ---------- MEDIA QUERIES ----------

const queryForMobile = window.matchMedia('(max-width: 425px)');
const queryForTablet = window.matchMedia('(max-width: 768px)');

if (queryForMobile.matches) {
  appElements.searchBar.addEventListener('focus', () => {
    logo.classList.add('hidden');
  })

  appElements.searchBar.addEventListener('blur', () => {
    logo.classList.remove('hidden');
  })
}

if (queryForTablet.matches) {
  appElements.sortOptionsMob.addEventListener('change', (e) => {
    const currentOption = e.target.options[e.target.selectedIndex];

    sortProducts(currentOption.value, currentOption.dataset.asc);
  });

  appElements.filtersButton.addEventListener('click', () => {
    filters.classList.toggle('active');
  })

  document.body.addEventListener('touchstart', handleTouchStart, false);
  document.body.addEventListener('touchend', handleTouchMove, false);

  let xDown = null;

  function handleTouchStart(event) {
    xDown = event.touches[0].clientX;
  };

  function handleTouchMove(event) {
    if (!xDown) {
      return;
    }

    const xUp = event.changedTouches[0].clientX;
    const xDiff = xUp - xDown;

    if (xDiff > 100 && xDown < 50) {
      handleSwipe(true);
      xDown = null;

      return;
    }

    if (xDiff < -150) {
      handleSwipe(false);
      xDown = null;

      return;
    }
  };

  function handleSwipe(open) {
    const filterClasses = filters.classList;

    filterClasses.toggle('active', open);
  };
}

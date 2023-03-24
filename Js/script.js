'use strict'

import { initialProducts } from "./initialProducts.js";

const filters = document.querySelector('.filters');
const sortOptions = document.querySelector('.sort-options');
const products = document.querySelector('.products');
const pagination = document.querySelector('.main__pagination');
const searchBar = document.querySelector('.header__field');
const basket = document.querySelector('.basket');

let currentSortOption = document.getElementById('default'); // stores state of sort buttons

let currentProducts = [...initialProducts]; // contains actual product-objects

const filterOptions = {
  min: getLimitPrice(initialProducts, 'min'),
  max: getLimitPrice(initialProducts, 'max'),
  memory: [],
  ram: [],
  sim: [],
  prod: [],
  security: [],

  searchRequest: '',

  setOptions(input, option) {
    let value = +input.value || input.value;

    if (option === 'price') {
      clearTimeout(this.timeout);

      const limit = input.dataset.limit;

      this.timeout = setTimeout(() => {
        if (!input.value.length) {
          setLimitPrices(initialProducts, limit);

          this[limit] = getLimitPrice(initialProducts, limit);
          return renderProducts();
        }

        this[limit] = value;

        renderProducts();
      }, 1000);

      return;
    }

    const optionArr = this[option];
    const valueIndex = optionArr.indexOf(value);
    
    input.checked
    ? optionArr.push(value)
    : optionArr.splice(valueIndex, 1)

    renderProducts();
  }, // set options to filterOptions object

  timeout: null,
}; // object contains options for filtration products

Object.defineProperties(filterOptions, {
  setOptions: { enumerable: false },
  timeout: { enumerable: false },
  searchRequest: { enumerable: false },
});

function getLimitPrice(arr, limit) {
  switch (limit) {
    case 'max':
      return Math.max(...arr.map(el => el.price));
    case 'min':
      return Math.min(...arr.map(el => el.price));
  }
} // get max or min price of products in given array

function setLimitPrices(arr, limit) {
  const min = document.querySelector('[data-limit="min"]');
  const max = document.querySelector('[data-limit="max"]');

  switch (limit) {
    case 'min':
      min.value = getLimitPrice(arr, limit);
      return;

    case 'max':
      max.value = getLimitPrice(arr, limit);
      return;
  }

  min.value = getLimitPrice(currentProducts, 'min');
  max.value = getLimitPrice(currentProducts, 'max');
} // set min and max values to price filter inputs

filters.addEventListener('click', (e) => {
  const description = e.target.closest('.filter__description');

  if (description) {
    description.classList.toggle('active', description);
  }
}); // open/close filters

// ---------- SEARCHING ----------

searchBar.addEventListener('input', searchProduct);

function searchProduct(event) {
  clearTimeout(searchProduct.timeout);

  const value = event.target.value.trim();

  searchProduct.timeout = setTimeout(() => {
    filterOptions.searchRequest = value;

    renderProducts();
  }, 1000);
} // handler for searchbar

searchProduct.timeout = null;

// ---------- FILTERING ----------

filters.addEventListener('input', (e) => {
  const filter = e.target.closest('.filter__content');
  const input = e.target;

  if (!filter) {
    return;
  }

  filterOptions.setOptions(input, filter.dataset.option);
}); // handle filter input

function filterProducts(options) {
  currentProducts = initialProducts.filter(product => {
    if (product.price < options.min || product.price > options.max) {
      return false;
    }

    for (const key in options) {
      const mustBe = options[key];
      const currentValue = product[key];

      if (mustBe.length && Array.isArray(currentValue)) {
        return mustBe.some(el => currentValue.includes(el));
      }

      if (mustBe.length && !mustBe.includes(currentValue)) {
        return false;
      }
    }

    return true;
  });

  if (options.searchRequest) {
    currentProducts = currentProducts.filter(product => {
      const name = product.name.toLowerCase();
      const request = options.searchRequest.toLowerCase().split(' ');

      return request.every(word => {
        if (name.startsWith(word)) {
          return true;
        }

        if (name.includes(word)) {
          return true;
        }
      })
    })
  }
} // filter initial products due to object with filter properties

// ---------- SORTING ----------

sortOptions.addEventListener('click', (e) => {
  const sortOption = e.target.closest('.sort-options__item');

  if (sortOption) {
    currentSortOption.classList.remove('active');
    sortOption.classList.toggle('active');

    currentSortOption = sortOption;

    sortProducts(sortOption.dataset.option, sortOption.id === 'price-asc');
  }
}); // handle sort buttons

function sortProducts(option, asc) {
  if (!option) {
    initialProducts.sort((a, b) => a.id - b.id);

    return renderProducts();
  }

  initialProducts.sort((a, b) => {
    if (asc) {
      return a[option] - b[option];
    }

    return b[option] - a[option];
  });

  renderProducts();
} // sort any list

products.addEventListener('click', (e) => {
  e.preventDefault();

  const productCard = e.target.closest('.product-card');
  const heart = e.target.closest('.product-card__icon');
  const buyButton = e.target.closest('.product-card__button');

  if (heart) {
    const InWishlist = getStorageCell('wishlist')
      .some(prod => prod.id === productCard.id);

    InWishlist
      ? removeFromStorageCell(productCard.id, 'wishlist')
      : addToStorageCell(productCard.id, 'wishlist', false)

    setWishlistCounter();
    return;
  }

  if (buyButton && !buyButton?.classList.contains('in-basket')) {
    addToStorageCell(productCard.id, 'basket', true);
  }
}); // handling events on product cards

let renderLimit = 8; // limit the count of products rendered

pagination.addEventListener('click', (e) => {
  if (!e.target.closest('.main__pagination-button')) {
    return;
  }

  if (renderLimit < currentProducts.length) {
    renderLimit += 8;
  }

  renderProducts();
}); // handle pagination button (increase render limit)

function renderProducts() {
  products.innerHTML = '';

  filterProducts(filterOptions);
  setProductsCount();
  updatePagination();
  setWishlistCounter();

  if (!currentProducts.length) {
    products.innerHTML = `
      <span class="no-goods">Нет подходящих товаров!</span>
    `
  }

  const iterationLimit = Math.min(renderLimit, currentProducts.length);

  for (let i = 0; i < iterationLimit; i++) {
    const product = currentProducts[i];

    const inBasket = getStorageCell('basket').some(prod => +prod.id === product.id);
    const InWishlist = getStorageCell('wishlist').some(prod => +prod.id === product.id);

    products.insertAdjacentHTML('beforeend', `
      <div class="product-card" id="${ product.id }">
        <a class="product-card__image-link" href="#">
          <img class="product-card__image"
            src="${ product.img }"
            alt="phone-image"
          >
        </a>

        <a class="product-card__name" href="#">
          ${ product.name }
        </a>

        <div class="product-card__rating">
          ${ getStars(product.rating) }
        </div>

        <span class="product-card__price-word">Цена</span>
        <span class="product-card__price">${ convertPrice(product.price) } грн</span>

        <div class="product-card__buy-section">
          <a href="#" class="buy-button product-card__button${ inBasket ? ` in-basket` : '' }">${ inBasket ? `В корзину` : `Купить`}</a>
          <a class="product-card__icon${ InWishlist ? ` active` : '' }" href="#">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="animatedSvg" d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="#000" stroke-width="2"/>
            </svg>
          </a>
        </div>

        <div class="product-card__description">
          <ul class="product-card__description-list">
            <li class="product-card__description-item">
              <span class="description-key">Дисплей (диагональ):</span>
              <span class="description-value">${ product.display }</span>
            </li>
            <li class="product-card__description-item">
              <span class="description-key">Встроенная память:</span>
              <span class="description-value">${ product.memory } ГБ</span>
            </li>
            <li class="product-card__description-item">
              <span class="description-key">Оперативная память:</span>
              <span class="description-value">${ product.ram } Гб</span>
            </li>
            <li class="product-card__description-item">
              <span class="description-key">Кол-во SIM-карт:</span>
              <span class="description-value">${ product.sim }</span>
            </li>
          </ul>
        </div>
      </div>
    `)
  }
}; // render products due to current sorting and filtering

function setProductsCount() {
  const counter = document.querySelector('.goods-counter');
  const productsCount = String(currentProducts.length);

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
} // set count of current products

function updatePagination() {
  pagination.classList.toggle('active', renderLimit < currentProducts.length);
} // update pagination button state

function getStars(rating) {
  let result = ``;

  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      result += `
        <img class="product-card__rating-star" src="https://www.moyo.ua/new-moyo/build/img/icon-star.svg" alt="active-star">
      `;
    } else {
      result += `
        <img class="product-card__rating-star" src="https://www.moyo.ua/new-moyo/build/img/icon-star--gray.svg" alt="active-star">
      `
    }
  }

  return result;
} // get count of rating stars

function convertPrice(price) {
  const priceStr = String(price);
  let result = '';

  if (priceStr.length < 4) {
    result += priceStr;

    return result;
  }

  for (let i = priceStr.length - 1; i >= 0; i--) {
    const numIndex = priceStr.length - i;

    if (numIndex % 3 === 0 && i !== 0) {
      result = ` ${priceStr[i]}` + result;
    } else {
      result = priceStr[i] + result;
    }
  }

  return result;
} // convert price from number to spaced string

initializePage();

// TEST ZONE

function initializePage() {
  if (!localStorage.getItem('basket')) {
    localStorage.setItem('basket', JSON.stringify([]));
  }

  if (!localStorage.getItem('wishlist')) {
    localStorage.setItem('wishlist', JSON.stringify([]));
  }

  renderProducts();
  setLimitPrices();
  renderBasket();
}

document.body.addEventListener('click', handleBasketState);

function handleBasketState(e) {
  const buyButton = e.target.closest('.product-card__button');
  const basketItem = e.target.closest('.basket__item');
  const basketIcon = e.target.closest('#basket-icon');
  const targetBasket = e.target.closest('.basket');

  if (basketIcon) {
    e.preventDefault();
    basket.classList.toggle('active');
    return;
  }

  if (buyButton?.classList.contains('in-basket')) {
    basket.classList.toggle('active', buyButton.classList.contains('in-basket'));
    return;
  }

  basket.classList.toggle('active', targetBasket || basketItem || buyButton);
}

// functions for storage manipulations

function addToStorageCell(id, cellName, incremental) {
  const cell = getStorageCell(cellName);

  const product = cell.find((el) => {
    return el.id === id;
  });

  if (product && incremental) {
    product.count = +product.count === 99 ? 99 : +product.count + 1;
  } else if (!product) {
    incremental ? cell.push({ id, count: 1 }) : cell.push({ id });
  }

  setStorageCell(cellName, cell);

  renderProducts();
  renderBasket();
}

function getStorageCell(cellName) {
  return JSON.parse(localStorage.getItem(cellName));
}

function setStorageCell(cellName, cell) {
  localStorage.setItem(cellName, JSON.stringify(cell));
}

function subtractFromStorageCell(id, cellName) {
  const cell = getStorageCell(cellName);

  const product = cell.find((el) => {
    return el.id === id;
  });

  product.count = +product.count - 1 || 1;

  setStorageCell(cellName, cell);

  renderProducts();
  renderBasket();
}

function removeFromStorageCell(id, cellName) {
  const cell = getStorageCell(cellName);
  const productIndex = cell.findIndex(prod => prod.id === id);

  cell.splice(productIndex, 1);

  setStorageCell(cellName, cell);

  renderProducts();
  renderBasket();
}

function clearStorageCell(cellName) {
  localStorage.setItem(cellName, JSON.stringify([]));

  renderProducts();
  renderBasket();
}

basket.addEventListener('click', (e) => {
  const basketItem = e.target.closest('.basket__item');
  const clear = e.target.closest('.basket__clear');
  const counter = e.target.closest('.basket__item-counter');
  const deleteBtn = e.target.closest('.basket__item-delete');

  if (clear) {
    clearStorageCell('basket');
  }

  if (deleteBtn) {
    removeFromStorageCell(basketItem.id, 'basket');
  }

  if (counter) {
    changeCount(basketItem, e);
  }
}); // handle different clicks in basket area

function changeCount(item, event) {
  const minus = item.querySelector('.count-button--minus');
  const plus = item.querySelector('.count-button--plus');

  if (event.target === minus) {
    subtractFromStorageCell(item.id, 'basket');
  }

  if (event.target === plus) {
    addToStorageCell(item.id, 'basket', true);
  }
}

function renderBasket() {
  const currentBasket = getStorageCell('basket');
  const basketContent = basket.querySelector('.basket__content');
  const totalPrice = basket.querySelector('.basket__total-price');
  const productsCounter = document.querySelector('.header__icon--basket .header__icon-counter');

  if (!currentBasket.length) {
    basketContent.classList.remove('active');
    productsCounter.parentElement.classList.remove('active');

    return;
  } else if (!basketContent.classList.contains('active')) {
    basketContent.classList.add('active');
    productsCounter.parentElement.classList.add('active');
  }

  basketContent.innerHTML = '';

  let sumOfPrices = 0;
  let countOfProducts = 0;

  currentBasket.forEach(product => {
    const initialProduct = initialProducts.find(el => el.id === +product.id);

    sumOfPrices += product.count * initialProduct.price;
    countOfProducts += product.count;

    basketContent.insertAdjacentHTML('beforeend', `
      <div class="basket__item" id="${ product.id }">
        <div class="basket__image-wrapper">
          <img
            src="${ initialProduct.img }"
            alt="phone image"
            class="basket__item-image"
          >
        </div>

        <div class="basket__item-description">
          <h3 class="basket__item-title">${ initialProduct.name }</h3>
          <span class="basket__item-price">${ convertPrice(initialProduct.price) } грн</span>
        </div>

        <div class="basket__item-counter">
          <button class="count-button count-button--minus"></button>
          <span class="basket__item-count">${ product.count }</span>
          <button class="count-button count-button--plus"></button>
        </div>

        <span class="basket__item-total">${ convertPrice(product.count * initialProduct.price) } грн</span>

        <button class="basket__item-delete">&#215;</button>
      </div>
    `)
  });

  totalPrice.innerHTML = `${convertPrice(sumOfPrices)} грн`;
  productsCounter.innerHTML = `${countOfProducts}`;
}

const clear = document.querySelector('.basket__clear');

clear.addEventListener('mouseover', (e) => {
  e.target.classList.add('active');
});

clear.addEventListener("mouseout", (e) => {
  e.target.classList.remove('active');
});

// WISHLIST

function setWishlistCounter() {
  const wishlistHeart = document.querySelector('.header__icon--heart');
  const wishlistCounter = wishlistHeart.querySelector('.header__icon-counter');
  const wishlist = getStorageCell('wishlist');

  wishlistHeart.classList.toggle('active', wishlist.length);
  wishlistCounter.innerHTML = `${wishlist.length}`;
}

// RICKROLLLLLL

const magicButton = document.querySelector('.basket__order-button');

magicButton.addEventListener('click', () => {
  document.body.innerHTML = `
    <div class="rickroll">
      <video src="./video/Rick Astley - Never Gonna Give You Up (Official Music Video).mp4" preload="auto" autoplay></video>
    </div>
  `;

  document.body.requestFullscreen();
});

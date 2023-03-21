'use strict'

import { initialProducts } from "./initialProducts.js";

const filters = document.querySelector('.filters');
const sortOptions = document.querySelector('.sort-options');
const products = document.querySelector('.products');
const pagination = document.querySelector('.main__pagination');
const searchBar = document.querySelector('.header__field');

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
  if (limit === 'max') {
    return Math.max(...arr.map(el => el.price));
  }

  return Math.min(...arr.map(el => el.price));
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
    description.classList.toggle('active');
  }
}); // Open/close filters

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
}); // Handle filter input

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
}); // Handle sort buttons

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
} // Sort any list

products.addEventListener('click', (e) => {
  e.preventDefault();

  const heart = e.target.closest('.product-card__icon');

  if (heart) {
    heart.classList.toggle('active');
  }
}); // Toggle state of heart button in product card

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

  const iterationLimit = Math.min(renderLimit, currentProducts.length);

  for (let i = 0; i < iterationLimit; i++) {
    const product = currentProducts[i];

    products.insertAdjacentHTML('beforeend', `
      <div class="product-card">
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
          <a href="#" class="product-card__button">Купить</a>
          <a class="product-card__icon${ product.favourite ? ` active` : '' }" href="#">
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
  if (renderLimit < currentProducts.length && !pagination.classList.contains('active')) {
    pagination.classList.add('active');
  }

  if (renderLimit >= currentProducts.length) {
    pagination.classList.remove('active');
  }
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

renderProducts();
setLimitPrices();

// TEST ZONE

const basketIcon = document.getElementById('basket-icon');
const basket = document.querySelector('.basket');

basketIcon.addEventListener('click', () => {
  basket.classList.toggle('active');
})

const clear = document.querySelector('.basket__clear');

clear.addEventListener('mouseover', (e) => {
  e.target.classList.add('active');
})

clear.addEventListener("mouseout", (e) => {
  e.target.classList.remove('active');
});


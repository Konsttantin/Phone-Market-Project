'use strict'

import { goods } from "./goods.js";

const filters = document.querySelector('.filters');
const sortOptions = document.querySelector('.sort-options');
const products = document.querySelector('.products');
let currentSortOption = document.getElementById('default');

// Opening/closing filters

filters.addEventListener('click', (e) => {
  const description = e.target.closest('.filter__description');

  if (description) {
    description.classList.toggle('active');
  }
});

// Switching styles of filter buttons

sortOptions.addEventListener('click', (e) => {
  const sortOption = e.target.closest('.sort-options__item');

  if (sortOption) {
    currentSortOption.classList.remove('active');
    sortOption.classList.toggle('active');

    currentSortOption = sortOption;
  }
});

// Toggling state of heart button in product card

products.addEventListener('click', (e) => {
  const heart = e.target.closest('.product-card__icon');
  if (heart) {
    heart.classList.toggle('active');
  }
});

function render(arr) {
  const products = document.querySelector('.products');

  products.innerHTML = '';

  arr.forEach(product => {
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

        <div class="product-card__rating 5stars">
          ${ getStars(product.rating) }
        </div>

        <span class="product-card__price-word">Цена</span>
        <span class="product-card__price">${ convertPrice(product.price) } грн</span>

        <div class="product-card__buy-section">
          <a href="#" class="product-card__button">Купить</a>
          <a class="product-card__icon${ product.favourite ? ` active` : '' }" href="#">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path class="animatedSvg" d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="#33363F" stroke-width="2"/>
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
  })
};

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
}

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
}

render(goods);

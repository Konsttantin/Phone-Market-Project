import { initialProducts } from "../initialProducts.js";

import { storage } from "./storage.js";
import { appElements } from "../app.js";
import { convertPrice } from "./renderProducts.js";

export const basketActions = {
  render() {
    const currentBasket = storage.getStorageCell('basket');
    const basketContent = appElements.basket.querySelector('.basket__content');
    const totalPrice = appElements.basket.querySelector('.basket__total-price');
    const productsCounter = document.querySelector('.header__icon--basket .header__icon-counter');
  
    basketContent.classList.toggle('active', currentBasket.length);
    productsCounter.parentElement.classList.toggle('active', currentBasket.length);
  
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
  },

  handleState(e) {
    const buyButton = e.target.closest('.product-card__button');
    const basketItem = e.target.closest('.basket__item');
    const basketIcon = e.target.closest('#basket-icon');
    const targetBasket = e.target.closest('.basket');
  
    if (basketIcon) {
      e.preventDefault();
      appElements.basket.classList.toggle('active');
      return;
    }
  
    if (buyButton?.classList.contains('in-basket')) {
      appElements.basket.classList.toggle('active', buyButton.classList.contains('in-basket'));
      return;
    }
  
    if (buyButton) {
      return;
    }
  
    appElements.basket.classList.toggle('active', targetBasket || basketItem);
  },

  changeCount(item, event) {
    const minus = item.querySelector('.count-button--minus');
    const plus = item.querySelector('.count-button--plus');
  
    if (event.target === minus) {
      storage.subtractFromStorageCell(item.id, 'basket');
    }
  
    if (event.target === plus) {
      storage.addToStorageCell(item.id, 'basket', true);
    }
  },
}

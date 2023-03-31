import { currentAppState } from "../app.js";

export function getLimitPrice(arr, limit) {
  switch (limit) {
    case 'max':
      return Math.max(...arr.map(el => el.price));
    case 'min':
      return Math.min(...arr.map(el => el.price));
  }
} // get max or min price of products in given array

export function setLimitPrices(arr, limit) {
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

min.value = getLimitPrice(currentAppState.products, 'min');
max.value = getLimitPrice(currentAppState.products, 'max');
} // set min and max values to price filter inputs

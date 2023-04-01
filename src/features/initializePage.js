import { renderProducts } from "./renderProducts.js";
import { setLimitPrices } from "./priceFunctions.js";
import { basketActions } from "./basketActions.js";

export function initializePage() {
  if (!localStorage.getItem('basket')) {
    localStorage.setItem('basket', JSON.stringify([]));
  }

  if (!localStorage.getItem('wishlist')) {
    localStorage.setItem('wishlist', JSON.stringify([]));
  }

  renderProducts();
  setLimitPrices();
  basketActions.render();
}

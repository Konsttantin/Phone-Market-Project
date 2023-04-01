import { appElements } from "../index.js";
import { currentAppState } from "../index.js";

import { storage } from "./storage.js";

export const wishlistActions = {
  setWishlistCounter() {
    const wishlistCounter = appElements.wishlistIcon.querySelector('.header__icon-counter');
    const wishlist = storage.getStorageCell('wishlist');

    appElements.wishlistIcon.classList.toggle('active', wishlist.length);
    wishlistCounter.innerHTML = `${wishlist.length}`;
  },

  sortByWishlist() {
    const wishlist = storage.getStorageCell('wishlist');

    if (!wishlist.length) {
      currentAppState.showFavorites = false;
      return;
    }

    currentAppState.products = currentAppState.products.filter(product => {
      return wishlist.some(fav => +fav.id === product.id);
    });
  },
}

import { initialProducts } from "../initialProducts.js";
import { currentAppState } from "../index.js";

export function filterProducts(options) {
  currentAppState.products = initialProducts.filter(product => {
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
    currentAppState.products = currentAppState.products.filter(product => {
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

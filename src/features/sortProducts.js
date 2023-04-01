import { initialProducts } from "../initialProducts.js";
import { renderProducts } from "./renderProducts.js";

export function sortProducts(option, asc) {
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
} // sort initialProducts due to incoming option

import { renderProducts } from "./renderProducts.js";
import { filterOptions } from "./filterOptions.js";

export function searchProduct(event) {
  clearTimeout(searchProduct.timeout);

  const value = event.target.value.trim();

  searchProduct.timeout = setTimeout(() => {
    filterOptions.searchRequest = value;

    renderProducts();
  }, 1000);
} // handler for searchbar

searchProduct.timeout = null;

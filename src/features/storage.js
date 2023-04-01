// functions for storage manipulations
import { renderProducts } from "./renderProducts.js";
import { basketActions } from "./basketActions.js";

export const storage = {
  addToStorageCell(id, cellName, incremental) {
    const cell = this.getStorageCell(cellName);
  
    const product = cell.find((el) => {
      return el.id === id;
    });
  
    if (product && incremental) {
      product.count = +product.count === 99 ? 99 : +product.count + 1;
    } else if (!product) {
      incremental ? cell.push({ id, count: 1 }) : cell.push({ id });
    }
  
    this.setStorageCell(cellName, cell);
  
    renderProducts();
    basketActions.render();
  },

  getStorageCell(cellName) {
    return JSON.parse(localStorage.getItem(cellName));
  },

  setStorageCell(cellName, cell) {
    localStorage.setItem(cellName, JSON.stringify(cell));
  },

  subtractFromStorageCell(id, cellName) {
    const cell = this.getStorageCell(cellName);
  
    const product = cell.find((el) => {
      return el.id === id;
    });
  
    product.count = +product.count - 1 || 1;
  
    this.setStorageCell(cellName, cell);
  
    renderProducts();
    basketActions.render();
  },

  removeFromStorageCell(id, cellName) {
    const cell = this.getStorageCell(cellName);
    const productIndex = cell.findIndex(prod => prod.id === id);
  
    cell.splice(productIndex, 1);
  
    this.setStorageCell(cellName, cell);
  
    renderProducts();
    basketActions.render();
  },

  clearStorageCell(cellName) {
    localStorage.setItem(cellName, JSON.stringify([]));
  
    renderProducts();
    basketActions.render();
  },
};

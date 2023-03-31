import { initialProducts } from "../initialProducts.js";
import { renderProducts } from "./renderProducts.js";
import { getLimitPrice, setLimitPrices } from "./priceFunctions.js";

export const filterOptions = {
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

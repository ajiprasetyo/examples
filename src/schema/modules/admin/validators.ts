import { ProductInput } from '../../../types';
import { VALIDATION_MESSAGES } from '../../../constants';

export const validateProductInput = (input: ProductInput): Record<string, string> => {
  const errors: Record<string, string> = {};
  const { name, description, price, stock } = input;

  // Validate name
  if (!name) {
    errors.name = VALIDATION_MESSAGES.PRODUCT_NAME_REQUIRED;
  }

  // Validate description
  if (!description) {
    errors.description = VALIDATION_MESSAGES.PRODUCT_DESCRIPTION_REQUIRED;
  }

  // Validate price
  if (price === undefined) {
    errors.price = VALIDATION_MESSAGES.PRODUCT_PRICE_REQUIRED;
  } else if (price <= 0) {
    errors.price = VALIDATION_MESSAGES.PRODUCT_PRICE_MIN;
  }

  // Validate stock
  if (stock === undefined) {
    errors.stock = VALIDATION_MESSAGES.PRODUCT_STOCK_REQUIRED;
  } else if (stock < 0) {
    errors.stock = VALIDATION_MESSAGES.PRODUCT_STOCK_MIN;
  }

  return errors;
};


import { OrderInput } from '../../../types';

export const validateOrderInput = (input: OrderInput): Record<string, string> => {
  const errors: Record<string, string> = {};
  const { productIds } = input;

  // Validate productIds
  if (!productIds || productIds.length === 0) {
    errors.productIds = 'At least one product is required';
  }

  return errors;
};


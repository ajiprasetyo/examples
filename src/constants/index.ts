export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Email is invalid',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
  PASSWORD_PATTERN: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  NAME_REQUIRED: 'Name is required',
  NAME_MIN_LENGTH: 'Name must be at least 2 characters long',
  PRODUCT_NAME_REQUIRED: 'Product name is required',
  PRODUCT_PRICE_REQUIRED: 'Product price is required',
  PRODUCT_PRICE_MIN: 'Product price must be greater than 0',
  PRODUCT_DESCRIPTION_REQUIRED: 'Product description is required',
  PRODUCT_STOCK_REQUIRED: 'Product stock is required',
  PRODUCT_STOCK_MIN: 'Product stock must be at least 0',
};


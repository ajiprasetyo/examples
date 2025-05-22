import { Request } from 'express';
import { JwtPayload } from '../middleware/auth';

export interface Context {
  user?: JwtPayload;
  token?: string;
  req: Request;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface OrderInput {
  productIds: string[];
  shippingAddress?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}


import { ApolloError, UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';
import { Context, OrderInput } from '../../../types';
import { isAuthenticated } from '../../../middleware/auth';
import { Product, Order } from '../shared/models';
import { validateOrderInput } from './validators';

export const userResolvers = {
  Query: {
    getAvailableProducts: async () => {
      try {
        // Get all products with stock > 0
        return await Product.find({ stock: { $gt: 0 } });
      } catch (error) {
        throw new ApolloError('Failed to fetch products');
      }
    },

    getProductById: async (_: any, { id }: { id: string }) => {
      try {
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError('Invalid product ID');
        }

        // Find product by ID
        const product = await Product.findById(id);
        if (!product) {
          throw new UserInputError('Product not found');
        }

        return product;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to fetch product');
      }
    },

    getMyOrders: async (_: any, __: any, context: Context) => {
      try {
        // Check if user is authenticated
        const user = isAuthenticated(context);

        // Get all orders for the current user
        return await Order.find({ user: user.id }).populate('products');
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to fetch orders');
      }
    },
  },

  Mutation: {
    createOrder: async (_: any, { input }: { input: OrderInput }, context: Context) => {
      try {
        // Check if user is authenticated
        const user = isAuthenticated(context);

        // Validate input
        const errors = validateOrderInput(input);
        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Invalid input', { errors });
        }

        const { productIds, shippingAddress } = input;

        // Check if all product IDs are valid
        const invalidIds = productIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
          throw new UserInputError('Invalid product IDs');
        }

        // Find all products
        const products = await Product.find({ _id: { $in: productIds } });

        // Check if all products exist
        if (products.length !== productIds.length) {
          throw new UserInputError('Some products not found');
        }

        // Check if all products are in stock
        const outOfStockProducts = products.filter(product => product.stock <= 0);
        if (outOfStockProducts.length > 0) {
          throw new UserInputError('Some products are out of stock', {
            products: outOfStockProducts.map(p => p.name),
          });
        }

        // Calculate total amount
        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        // Create new order
        const order = new Order({
          user: user.id,
          products: productIds,
          totalAmount,
          shippingAddress,
        });

        // Save order to database
        await order.save();

        // Update product stock
        await Promise.all(
          products.map(product => {
            product.stock -= 1;
            return product.save();
          })
        );

        // Populate products and return order
        await order.populate('products');
        return order;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to create order');
      }
    },
  },
};


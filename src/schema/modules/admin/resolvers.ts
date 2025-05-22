import { ApolloError, UserInputError } from 'apollo-server-express';
import mongoose from 'mongoose';
import { Context, ProductInput } from '../../../types';
import { isAdmin } from '../../../middleware/auth';
import { Product, User, Order } from '../shared/models';
import { validateProductInput } from './validators';

export const adminResolvers = {
  Query: {
    getAllProducts: async (_: any, __: any, context: Context) => {
      try {
        // Check if user is admin
        isAdmin(context);

        // Get all products
        return await Product.find();
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to fetch products');
      }
    },

    getAllOrders: async (_: any, __: any, context: Context) => {
      try {
        // Check if user is admin
        isAdmin(context);

        // Get all orders
        return await Order.find().populate('user').populate('products');
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to fetch orders');
      }
    },

    getAllUsers: async (_: any, __: any, context: Context) => {
      try {
        // Check if user is admin
        isAdmin(context);

        // Get all users
        return await User.find().select('-password');
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to fetch users');
      }
    },
  },

  Mutation: {
    createProduct: async (_: any, { input }: { input: ProductInput }, context: Context) => {
      try {
        // Check if user is admin
        isAdmin(context);

        // Validate input
        const errors = validateProductInput(input);
        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Invalid input', { errors });
        }

        // Create new product
        const product = new Product(input);

        // Save product to database
        await product.save();

        return product;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to create product');
      }
    },

    updateProduct: async (
      _: any,
      { id, input }: { id: string; input: ProductInput },
      context: Context
    ) => {
      try {
        // Check if user is admin
        isAdmin(context);

        // Validate input
        const errors = validateProductInput(input);
        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Invalid input', { errors });
        }

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError('Invalid product ID');
        }

        // Find and update product
        const product = await Product.findByIdAndUpdate(id, input, { new: true });
        if (!product) {
          throw new UserInputError('Product not found');
        }

        return product;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to update product');
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        // Check if user is admin
        isAdmin(context);

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new UserInputError('Invalid product ID');
        }

        // Find and delete product
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
          throw new UserInputError('Product not found');
        }

        return true;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new ApolloError('Failed to delete product');
      }
    },
  },
};


import { gql } from 'apollo-server-express';

export const sharedTypeDefs = gql`
  # Base types
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    imageUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type Order {
    id: ID!
    user: User!
    products: [Product!]!
    totalAmount: Float!
    status: String!
    shippingAddress: String
    createdAt: String!
    updatedAt: String!
  }

  # Authentication types
  type AuthPayload {
    token: String!
    user: User!
  }

  # Input types
  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    description: String!
    price: Float!
    stock: Int!
    imageUrl: String
  }

  input OrderInput {
    productIds: [ID!]!
    shippingAddress: String
  }
`;


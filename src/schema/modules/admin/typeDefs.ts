import { gql } from 'apollo-server-express';

export const adminTypeDefs = gql`
  extend type Query {
    getAllProducts: [Product!]!
    getAllOrders: [Order!]!
    getAllUsers: [User!]!
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }
`;


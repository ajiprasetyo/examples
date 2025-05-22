import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  extend type Query {
    getAvailableProducts: [Product!]!
    getProductById(id: ID!): Product
    getMyOrders: [Order!]!
  }

  extend type Mutation {
    createOrder(input: OrderInput!): Order!
  }
`;


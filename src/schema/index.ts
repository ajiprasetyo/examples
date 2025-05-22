import { gql } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Import type definitions
import { sharedTypeDefs } from './modules/shared/typeDefs';
import { authTypeDefs, authResolvers } from './modules/shared/auth';
import { userTypeDefs, userResolvers } from './modules/user';
import { adminTypeDefs, adminResolvers } from './modules/admin';

// Base type definitions
const baseTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

// Combine all type definitions
const typeDefs = [
  baseTypeDefs,
  sharedTypeDefs,
  authTypeDefs,
  userTypeDefs,
  adminTypeDefs,
];

// Combine all resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...userResolvers.Mutation,
    ...adminResolvers.Mutation,
  },
};

// Create executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


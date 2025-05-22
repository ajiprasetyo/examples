import { gql } from 'apollo-server-express';

export const authTypeDefs = gql`
  extend type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    loginAdmin(input: LoginInput!): AuthPayload!
  }
`;


import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        firstName
        lastName
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $tenantSlug: String!
  ) {
    register(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      tenantSlug: $tenantSlug
    ) {
      success
      message
      user {
        id
        email
        firstName
        lastName
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

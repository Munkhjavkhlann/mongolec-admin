import { gql } from '@apollo/client'

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      isActive
      createdAt
      updatedAt
    }
  }
`

export const GET_TENANTS = gql`
  query GetTenants {
    tenants {
      id
      name
      slug
      domain
      isActive
      createdAt
      updatedAt
    }
  }
`

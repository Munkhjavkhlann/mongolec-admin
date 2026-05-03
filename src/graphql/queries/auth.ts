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
      tenant {
        id
        slug
        name
      }
      roles {
        id
        role {
          id
          name
        }
      }
    }
  }
`

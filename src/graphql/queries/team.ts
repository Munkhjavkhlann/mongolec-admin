import { gql } from '@apollo/client'

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers {
    getTeamMembers {
      id
      tenantId
      name
      role
      bio
      photo
      email
      linkedinUrl
      twitterUrl
      displayOrder
      isActive
      createdAt
      updatedAt
    }
  }
`

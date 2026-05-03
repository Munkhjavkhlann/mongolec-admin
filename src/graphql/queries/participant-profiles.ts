import { gql } from '@apollo/client'

export const GET_PARTICIPANT_PROFILES = gql`
  query GetParticipantProfiles($limit: Int, $page: Int, $isActive: Boolean) {
    getParticipants(limit: $limit, page: $page, isActive: $isActive) {
      participants {
        id
        firstName
        lastName
        photo
        country
        bio
        isActive
        displayOrder
        rallyYears
        createdAt
        updatedAt
      }
      pagination {
        total
        totalPages
        currentPage
        perPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export const GET_PARTICIPANT_PROFILE = gql`
  query GetParticipantProfile($id: ID!) {
    getParticipant(id: $id) {
      id
      firstName
      lastName
      photo
      country
      bio
      isActive
      displayOrder
      rallyYears
      createdAt
      updatedAt
    }
  }
`

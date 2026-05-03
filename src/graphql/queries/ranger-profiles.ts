import { gql } from '@apollo/client'

export const GET_RANGERS_PROFILES = gql`
  query GetRangersProfiles($limit: Int, $page: Int, $isActive: Boolean) {
    getRangers(limit: $limit, page: $page, isActive: $isActive) {
      rangers {
        id
        name
        photo
        parkName
        country
        bio
        displayOrder
        isActive
        rallyId
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

export const GET_RANGER_PROFILE = gql`
  query GetRangerProfile($id: ID!) {
    getRanger(id: $id) {
      id
      name
      photo
      parkName
      country
      bio
      displayOrder
      isActive
      rallyId
      createdAt
      updatedAt
    }
  }
`

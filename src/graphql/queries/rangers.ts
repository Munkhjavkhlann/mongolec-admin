import { gql } from '@apollo/client'

export const GET_PARK_PARTNERSHIPS = gql`
  query GetParkPartnerships(
    $status: PartnershipStatus
    $country: String
    $limit: Int
    $page: Int
  ) {
    getParkPartnerships(
      status: $status
      country: $country
      limit: $limit
      page: $page
    ) {
      id
      parkName
      country
      location
      establishedDate
      partnershipType
      rangersCount
      areaSize
      keyChallenges
      contactPerson
      contactEmail
      contactPhone
      photos
      videos
      rallies
      status
      createdAt
      updatedAt
    }
  }
`

export const GET_PARK_PARTNERSHIP = gql`
  query GetParkPartnership($id: ID!) {
    getParkPartnership(id: $id) {
      id
      parkName
      country
      location
      establishedDate
      partnershipType
      rangersCount
      areaSize
      keyChallenges
      contactPerson
      contactEmail
      contactPhone
      photos
      videos
      rallies
      status
      createdAt
      updatedAt
    }
  }
`

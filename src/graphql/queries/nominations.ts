import { gql } from '@apollo/client'

export const GET_NOMINATIONS = gql`
  query GetNominations(
    $status: NominationStatus
    $country: String
    $limit: Int
    $offset: Int
  ) {
    nominations(
      status: $status
      country: $country
      limit: $limit
      offset: $offset
    ) {
      nominations {
        id
        country
        parkNames
        parkWebsites
        parkContactFirstName
        parkContactLastName
        parkContactEmail
        partnerOrganizationName
        partnerContactFirstName
        partnerContactLastName
        partnerContactEmail
        partnerWebsite
        partnerAddress
        primaryMission
        motorcycleSupport
        partnerLogisticsSupport
        otherInfo
        status
        reviewedBy
        reviewedAt
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

export const GET_NOMINATION = gql`
  query GetNomination($id: ID!) {
    nominationById(id: $id) {
      id
      country
      parkNames
      parkWebsites
      parkContactFirstName
      parkContactLastName
      parkContactEmail
      partnerOrganizationName
      partnerContactFirstName
      partnerContactLastName
      partnerContactEmail
      partnerWebsite
      partnerAddress
      primaryMission
      motorcycleSupport
      partnerLogisticsSupport
      otherInfo
      howHeard
      status
      reviewedBy
      reviewedAt
      reviewNotes
      createdAt
      updatedAt
    }
  }
`

export const GET_NOMINATION_STATS = gql`
  query GetNominationStats {
    nominationStats {
      total
      pending
      underReview
      approved
      rejected
      selected
      notSelected
    }
  }
`

export const CHECK_IF_NOMINATED = gql`
  query CheckIfNominated($parkName: String!, $country: String!) {
    checkIfNominated(parkName: $parkName, country: $country) {
      nominated
      nominationId
    }
  }
`

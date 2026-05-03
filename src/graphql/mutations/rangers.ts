import { gql } from '@apollo/client'

export const CREATE_PARK_PARTNERSHIP = gql`
  mutation CreateParkPartnership($data: ParkPartnershipCreateInput!) {
    createParkPartnership(data: $data) {
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

export const UPDATE_PARK_PARTNERSHIP = gql`
  mutation UpdateParkPartnership($id: ID!, $data: ParkPartnershipUpdateInput!) {
    updateParkPartnership(id: $id, data: $data) {
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

export const CHANGE_PARTNERSHIP_STATUS = gql`
  mutation ChangePartnershipStatus($id: ID!, $status: PartnershipStatus!) {
    changePartnershipStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`

export const DELETE_PARK_PARTNERSHIP = gql`
  mutation DeleteParkPartnership($id: ID!) {
    deleteParkPartnership(id: $id) {
      success
      message
    }
  }
`

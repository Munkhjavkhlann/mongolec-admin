import { gql } from '@apollo/client'

export const CREATE_RANGER_PROFILE = gql`
  mutation CreateRangerProfile($input: CreateRangerInput!) {
    createRanger(input: $input) {
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

export const UPDATE_RANGER_PROFILE = gql`
  mutation UpdateRangerProfile($id: ID!, $input: UpdateRangerInput!) {
    updateRanger(id: $id, input: $input) {
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

export const DELETE_RANGER_PROFILE = gql`
  mutation DeleteRangerProfile($id: ID!) {
    deleteRanger(id: $id)
  }
`

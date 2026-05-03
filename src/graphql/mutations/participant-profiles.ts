import { gql } from '@apollo/client'

export const CREATE_PARTICIPANT_PROFILE = gql`
  mutation CreateParticipantProfile($input: CreateParticipantInput!) {
    createParticipant(input: $input) {
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

export const UPDATE_PARTICIPANT_PROFILE = gql`
  mutation UpdateParticipantProfile($id: ID!, $input: UpdateParticipantInput!) {
    updateParticipant(id: $id, input: $input) {
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

export const DELETE_PARTICIPANT_PROFILE = gql`
  mutation DeleteParticipantProfile($id: ID!) {
    deleteParticipant(id: $id)
  }
`

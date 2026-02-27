import { gql } from '@apollo/client'

export const CREATE_RALLY = gql`
  mutation CreateRally($input: CreateRallyInput!) {
    createRally(input: $input) {
      id
      title
      slug
      description
      startDate
      endDate
      location
      duration
      targetAudience
      maxParticipants
      currentParticipants
      heroImage
      heroVideo
      isRecruiting
      applicationDeadline
      status
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_RALLY = gql`
  mutation UpdateRally($id: ID!, $input: UpdateRallyInput!) {
    updateRally(id: $id, input: $input) {
      id
      title
      slug
      description
      startDate
      endDate
      location
      duration
      targetAudience
      maxParticipants
      currentParticipants
      heroImage
      heroVideo
      isRecruiting
      applicationDeadline
      status
      createdAt
      updatedAt
    }
  }
`

export const DELETE_RALLY = gql`
  mutation DeleteRally($id: ID!) {
    deleteRally(id: $id)
  }
`

export const UPDATE_RALLY_STATUS = gql`
  mutation UpdateRallyStatus($id: ID!, $status: RallyStatus!) {
    updateRallyStatus(id: $id, status: $status) {
      id
      title
      status
      updatedAt
    }
  }
`

export const TOGGLE_RECRUITING = gql`
  mutation ToggleRecruiting($id: ID!) {
    toggleRecruiting(id: $id) {
      id
      title
      isRecruiting
      updatedAt
    }
  }
`

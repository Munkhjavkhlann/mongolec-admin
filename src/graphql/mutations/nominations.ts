import { gql } from '@apollo/client'

export const SUBMIT_PARK_NOMINATION = gql`
  mutation SubmitParkNomination($input: ParkNominationInput!) {
    submitParkNomination(input: $input) {
      id
      parkName
      country
      status
      createdAt
    }
  }
`

export const UPDATE_NOMINATION = gql`
  mutation UpdateNomination($id: ID!, $input: UpdateNominationInput!) {
    updateNomination(id: $id, input: $input) {
      id
      parkName
      country
      updatedAt
    }
  }
`

export const UPDATE_NOMINATION_STATUS = gql`
  mutation UpdateNominationStatus(
    $id: ID!
    $status: NominationStatus!
    $notes: String
  ) {
    updateNominationStatus(id: $id, status: $status, notes: $notes) {
      id
      status
      reviewNotes
      reviewedBy
      reviewedAt
      updatedAt
    }
  }
`

export const APPROVE_NOMINATION = gql`
  mutation ApproveNomination($id: ID!, $notes: String) {
    approveNomination(id: $id, notes: $notes) {
      id
      status
      reviewNotes
      reviewedBy
      reviewedAt
      updatedAt
    }
  }
`

export const REJECT_NOMINATION = gql`
  mutation RejectNomination($id: ID!, $reason: String!) {
    rejectNomination(id: $id, reason: $reason) {
      id
      status
      reviewNotes
      reviewedBy
      reviewedAt
      updatedAt
    }
  }
`

export const SELECT_NOMINATION = gql`
  mutation SelectNomination($id: ID!, $rallyId: ID!) {
    selectNomination(id: $id, rallyId: $rallyId) {
      id
      status
      selectedForRallyId
      updatedAt
    }
  }
`

export const ADD_REVIEW_NOTE = gql`
  mutation AddReviewNote($id: ID!, $note: String!) {
    addReviewNote(id: $id, note: $note) {
      id
      reviewNotes
      updatedAt
    }
  }
`

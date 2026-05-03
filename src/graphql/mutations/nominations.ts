import { gql } from '@apollo/client'
import { NOMINATION_REVIEW_FIELDS } from '../fragments/nomination'

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
    updateParkNomination(id: $id, data: $input) {
      id
      parkName
      country
      updatedAt
    }
  }
`

export const CHANGE_NOMINATION_STATUS = gql`
  ${NOMINATION_REVIEW_FIELDS}
  mutation ChangeNominationStatus(
    $id: ID!
    $status: NominationStatus!
    $notes: String
  ) {
    changeNominationStatus(id: $id, status: $status, notes: $notes) {
      ...NominationReviewFields
    }
  }
`

export const APPROVE_NOMINATION = gql`
  ${NOMINATION_REVIEW_FIELDS}
  mutation ApproveNomination($id: ID!, $notes: String) {
    approveNomination(id: $id, notes: $notes) {
      ...NominationReviewFields
    }
  }
`

export const REJECT_NOMINATION = gql`
  ${NOMINATION_REVIEW_FIELDS}
  mutation RejectNomination($id: ID!, $reason: String!) {
    rejectNomination(id: $id, reason: $reason) {
      ...NominationReviewFields
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

import { gql } from '@apollo/client'
import { RALLY_FIELDS } from '../fragments/rally'

export const CREATE_RALLY = gql`
  ${RALLY_FIELDS}
  mutation CreateRally($input: RallyCreateInput!) {
    createRally(data: $input) {
      ...RallyFields
    }
  }
`

export const UPDATE_RALLY = gql`
  ${RALLY_FIELDS}
  mutation UpdateRally($id: ID!, $input: RallyUpdateInput!) {
    updateRally(id: $id, data: $input) {
      ...RallyFields
    }
  }
`

export const DELETE_RALLY = gql`
  mutation DeleteRally($id: ID!) {
    deleteRally(id: $id) {
      success
      message
    }
  }
`

export const CHANGE_RALLY_STATUS = gql`
  mutation ChangeRallyStatus($id: ID!, $status: RallyStatus!) {
    changeRallyStatus(id: $id, status: $status) {
      id
      title
      status
      updatedAt
    }
  }
`

export const TOGGLE_RALLY_RECRUITING = gql`
  mutation ToggleRallyRecruiting($id: ID!) {
    toggleRallyRecruiting(id: $id) {
      id
      title
      isRecruiting
      updatedAt
    }
  }
`

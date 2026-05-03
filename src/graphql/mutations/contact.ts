import { gql } from '@apollo/client'

export const UPDATE_CONTACT_MESSAGE_STATUS = gql`
  mutation UpdateContactMessageStatus(
    $id: ID!
    $status: ContactMessageStatus!
  ) {
    changeContactMessageStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`

import { gql } from '@apollo/client'

export const GET_CONTACT_MESSAGES = gql`
  query GetContactMessages(
    $page: Int
    $limit: Int
    $status: ContactMessageStatus
  ) {
    getContactMessages(page: $page, limit: $limit, status: $status) {
      items {
        id
        tenantId
        name
        email
        subject
        message
        status
        createdAt
        updatedAt
      }
      total
      page
      limit
    }
  }
`

export const GET_CONTACT_MESSAGE = gql`
  query GetContactMessage($id: ID!) {
    getContactMessage(id: $id) {
      id
      tenantId
      name
      email
      subject
      message
      status
      createdAt
      updatedAt
    }
  }
`

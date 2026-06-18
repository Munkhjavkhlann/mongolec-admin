import { gql } from '@apollo/client'

export const UPDATE_MERCH_ORDER_STATUS = gql`
  mutation UpdateMerchOrderStatus($id: ID!, $status: String!) {
    updateMerchOrderStatus(id: $id, status: $status) {
      id
      orderNumber
      status
      updatedAt
    }
  }
`

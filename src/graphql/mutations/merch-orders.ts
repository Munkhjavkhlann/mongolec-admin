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

export const EXPORT_MERCH_ORDERS = gql`
  mutation ExportMerchOrders($input: ExportMerchOrdersInput!) {
    exportMerchOrders(input: $input) {
      filename
      mimeType
      base64
      count
    }
  }
`

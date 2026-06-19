import { gql } from '@apollo/client'

export const GET_MERCH_ORDERS = gql`
  query GetMerchOrders($status: String, $tenantId: String, $limit: Int, $offset: Int) {
    getMerchOrders(status: $status, tenantId: $tenantId, limit: $limit, offset: $offset) {
      id
      orderNumber
      userId
      customerName
      phone
      email
      address
      notes
      status
      deliveryMethod
      paymentMethod
      paymentClaimedAt
      subtotal
      total
      currency
      tenantId
      items {
        id
        productId
        name
        image
        variantId
        variantName
        unitPrice
        quantity
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_ORDER_BY_ID = gql`
  query GetMerchOrderById($id: ID!) {
    getMerchOrderById(id: $id) {
      id
      orderNumber
      userId
      customerName
      phone
      email
      address
      notes
      status
      deliveryMethod
      paymentMethod
      paymentClaimedAt
      subtotal
      total
      currency
      tenantId
      items {
        id
        productId
        name
        image
        variantId
        variantName
        unitPrice
        quantity
      }
      createdAt
      updatedAt
    }
  }
`

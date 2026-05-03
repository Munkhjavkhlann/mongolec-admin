import { gql } from '@apollo/client'
import { PAGINATION_FIELDS } from '../fragments/pagination'

export const GET_NEWSLETTER_SUBSCRIPTIONS = gql`
  ${PAGINATION_FIELDS}
  query GetNewsletterSubscriptions(
    $status: SubscriptionStatus
    $search: String
    $limit: Int
    $page: Int
  ) {
    getNewsletterSubscriptions(
      status: $status
      search: $search
      limit: $limit
      page: $page
    ) {
      subscriptions {
        id
        email
        firstName
        lastName
        status
        source
        interests
        createdAt
        updatedAt
      }
      pagination {
        ...PaginationFields
      }
    }
  }
`

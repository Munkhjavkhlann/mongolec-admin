import { gql } from '@apollo/client'

export const PAGINATION_FIELDS = gql`
  fragment PaginationFields on PaginationInfo {
    total
    totalPages
    currentPage
    perPage
    hasNextPage
    hasPreviousPage
  }
`

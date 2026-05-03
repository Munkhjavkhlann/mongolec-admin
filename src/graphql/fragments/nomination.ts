import { gql } from '@apollo/client'

export const NOMINATION_REVIEW_FIELDS = gql`
  fragment NominationReviewFields on ParkNomination {
    id
    status
    reviewNotes
    reviewedBy
    reviewedAt
    updatedAt
  }
`

import { gql } from '@apollo/client'

export const GET_RALLIES = gql`
  query GetRallies(
    $language: String
    $status: String
    $limit: Int
    $offset: Int
  ) {
    rallies(
      language: $language
      status: $status
      limit: $limit
      offset: $offset
    ) {
      rallies {
        id
        title
        slug
        description
        startDate
        endDate
        location
        duration
        targetAudience
        maxParticipants
        currentParticipants
        heroImage
        heroVideo
        isRecruiting
        applicationDeadline
        status
        createdAt
        updatedAt
      }
      pagination {
        total
        totalPages
        currentPage
        perPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export const GET_RALLY_BY_ID = gql`
  query GetRallyById($id: ID!, $language: String) {
    rallyById(id: $id, language: $language) {
      id
      title
      slug
      description
      startDate
      endDate
      location
      duration
      targetAudience
      maxParticipants
      currentParticipants
      heroImage
      heroVideo
      isRecruiting
      applicationDeadline
      status
      createdAt
      updatedAt
    }
  }
`

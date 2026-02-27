import { gql } from '@apollo/client'

export const CREATE_STORY = gql`
  mutation CreateStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      id
      slug
      title
      excerpt
      content
      type
      status
      featured
      author
      role
      featuredImage
      gallery
      videoUrl
      beforeAfterData
      impactSummary
      tags
      publishedAt
      scheduledAt
      rally {
        id
        name
        slug
      }
      relatedRallies {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_STORY = gql`
  mutation UpdateStory($id: ID!, $input: UpdateStoryInput!) {
    updateStory(id: $id, input: $input) {
      id
      slug
      title
      excerpt
      content
      type
      status
      featured
      author
      role
      featuredImage
      gallery
      videoUrl
      beforeAfterData
      impactSummary
      tags
      publishedAt
      scheduledAt
      rally {
        id
        name
        slug
      }
      relatedRallies {
        id
        name
        slug
      }
      createdAt
      updatedAt
    }
  }
`

export const DELETE_STORY = gql`
  mutation DeleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`

export const PUBLISH_STORY = gql`
  mutation PublishStory($id: ID!) {
    publishStory(id: $id) {
      id
      status
      publishedAt
    }
  }
`

export const UNPUBLISH_STORY = gql`
  mutation UnpublishStory($id: ID!) {
    unpublishStory(id: $id) {
      id
      status
      publishedAt
    }
  }
`

export const TOGGLE_STORY_FEATURED = gql`
  mutation ToggleStoryFeatured($id: ID!) {
    toggleStoryFeatured(id: $id) {
      id
      featured
    }
  }
`

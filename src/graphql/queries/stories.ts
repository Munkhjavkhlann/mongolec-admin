import { gql } from '@apollo/client'

export const GET_STORIES = gql`
  query GetStories(
    $type: String
    $status: String
    $rallyId: ID
    $featured: Boolean
    $limit: Int
    $offset: Int
  ) {
    stories(
      type: $type
      status: $status
      rallyId: $rallyId
      featured: $featured
      limit: $limit
      offset: $offset
    ) {
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
        startDate
        endDate
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

export const GET_STORY = gql`
  query GetStory($id: ID!) {
    storyById(id: $id) {
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
        startDate
        endDate
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

export const GET_PUBLISHED_STORIES = gql`
  query GetPublishedStories(
    $type: String
    $rallyId: ID
    $featured: Boolean
    $limit: Int
    $offset: Int
  ) {
    publishedStories(
      type: $type
      rallyId: $rallyId
      featured: $featured
      limit: $limit
      offset: $offset
    ) {
      id
      slug
      title
      excerpt
      type
      featured
      author
      role
      featuredImage
      gallery
      videoUrl
      tags
      publishedAt
      rally {
        id
        name
        slug
        startDate
        endDate
      }
      relatedRallies {
        id
        name
        slug
      }
    }
  }
`

export const GET_FEATURED_STORIES = gql`
  query GetFeaturedStories($limit: Int, $type: String) {
    featuredStories(limit: $limit, type: $type) {
      id
      slug
      title
      excerpt
      type
      featured
      author
      role
      featuredImage
      gallery
      videoUrl
      tags
      publishedAt
      rally {
        id
        name
        slug
      }
    }
  }
`

export const GET_STORY_STATS = gql`
  query GetStoryStats {
    storyStats {
      total
      published
      draft
      featured
      byType {
        type
        count
      }
    }
  }
`

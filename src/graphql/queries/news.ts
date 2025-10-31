import { gql } from '@apollo/client'

export const GET_NEWS_ARTICLES = gql`
  query GetNewsArticles(
    $language: String
    $status: String
    $priority: String
    $categoryId: ID
    $limit: Int
    $offset: Int
  ) {
    newsArticles(
      language: $language
      status: $status
      priority: $priority
      categoryId: $categoryId
      limit: $limit
      offset: $offset
    ) {
      id
      slug
      title
      subtitle
      excerpt
      byline
      blocks
      featuredImage
      socialImage
      location
      source
      status
      priority
      isBreaking
      isFeatured
      metaTitle
      metaDescription
      keywords
      publishedAt
      scheduledAt
      category {
        id
        name
        slug
        description
        color
        icon
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_NEWS_ARTICLE_BY_ID = gql`
  query GetNewsArticleById($id: ID!, $language: String) {
    newsArticleById(id: $id, language: $language) {
      id
      slug
      title
      subtitle
      excerpt
      byline
      blocks
      featuredImage
      socialImage
      location
      source
      status
      priority
      isBreaking
      isFeatured
      metaTitle
      metaDescription
      keywords
      publishedAt
      scheduledAt
      category {
        id
        name
        slug
        description
        color
        icon
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_NEWS_CATEGORIES = gql`
  query GetNewsCategories($language: String) {
    newsCategories(language: $language) {
      id
      name
      slug
      description
      color
      createdAt
      updatedAt
    }
  }
`

export const GET_NEWS_CATEGORY_BY_ID = gql`
  query GetNewsCategoryById($id: ID!, $language: String) {
    newsCategoryById(id: $id, language: $language) {
      id
      name
      slug
      description
      color
      createdAt
      updatedAt
    }
  }
`

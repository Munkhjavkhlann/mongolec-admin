import { gql } from '@apollo/client'

export const GET_MERCH_PRODUCTS = gql`
  query GetMerchProducts(
    $language: String
    $status: String
    $categoryId: ID
    $isFeatured: Boolean
    $limit: Int
    $offset: Int
  ) {
    merchProducts(
      language: $language
      status: $status
      categoryId: $categoryId
      isFeatured: $isFeatured
      limit: $limit
      offset: $offset
    ) {
      id
      sku
      name
      description
      shortDescription
      price
      compareAtPrice
      costPrice
      currency
      inventory
      trackInventory
      allowBackorder
      minStock
      maxStock
      weight
      dimensions
      featuredImage
      images
      tags
      hasVariants
      options
      variants {
        id
        sku
        barcode
        title
        optionValues
        price
        compareAtPrice
        costPrice
        inventory
        weight
        dimensions
        image
        position
        isAvailable
        createdAt
        updatedAt
      }
      metaTitle
      metaDescription
      searchKeywords
      status
      isFeatured
      isDigital
      publishedAt
      category {
        id
        name
        slug
        description
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_PRODUCT_BY_ID = gql`
  query GetMerchProductById($id: ID!, $language: String) {
    merchProductById(id: $id, language: $language) {
      id
      sku
      name
      description
      shortDescription
      price
      compareAtPrice
      costPrice
      currency
      inventory
      trackInventory
      allowBackorder
      minStock
      maxStock
      weight
      dimensions
      featuredImage
      images
      tags
      hasVariants
      options
      variants {
        id
        sku
        barcode
        title
        optionValues
        price
        compareAtPrice
        costPrice
        inventory
        weight
        dimensions
        image
        position
        isAvailable
        createdAt
        updatedAt
      }
      metaTitle
      metaDescription
      searchKeywords
      status
      isFeatured
      isDigital
      publishedAt
      category {
        id
        name
        slug
        description
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_CATEGORIES = gql`
  query GetMerchCategories($language: String) {
    merchCategories(language: $language) {
      id
      name
      slug
      description
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_CATEGORY_BY_ID = gql`
  query GetMerchCategoryById($id: ID!, $language: String) {
    merchCategoryById(id: $id, language: $language) {
      id
      name
      slug
      description
      createdAt
      updatedAt
    }
  }
`

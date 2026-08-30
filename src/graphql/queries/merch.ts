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
    getMerchProducts(
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
    getMerchProductById(id: $id, language: $language) {
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
      discounts {
        id
      }
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_CATEGORIES = gql`
  query GetMerchCategories($language: String) {
    getMerchCategories(language: $language) {
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
    getMerchCategoryById(id: $id, language: $language) {
      id
      name
      slug
      description
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_DISCOUNTS = gql`
  query GetMerchDiscounts(
    $tenantId: ID
    $tenantSlug: String
    $isActive: Boolean
    $limit: Int
    $offset: Int
  ) {
    getMerchDiscounts(
      tenantId: $tenantId
      tenantSlug: $tenantSlug
      isActive: $isActive
      limit: $limit
      offset: $offset
    ) {
      id
      name
      type
      value
      startDate
      endDate
      isActive
      productIds
      createdAt
      updatedAt
    }
  }
`

export const GET_MERCH_DISCOUNT_BY_ID = gql`
  query GetMerchDiscountById($id: ID!) {
    getMerchDiscountById(id: $id) {
      id
      name
      type
      value
      startDate
      endDate
      isActive
      productIds
      createdAt
      updatedAt
    }
  }
`

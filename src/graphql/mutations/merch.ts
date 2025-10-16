import { gql } from '@apollo/client'

export const CREATE_MERCH_PRODUCT = gql`
  mutation CreateMerchProduct($input: CreateMerchProductInput!) {
    createMerchProduct(input: $input) {
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
      variants
      options
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

export const UPDATE_MERCH_PRODUCT = gql`
  mutation UpdateMerchProduct($id: ID!, $input: UpdateMerchProductInput!) {
    updateMerchProduct(id: $id, input: $input) {
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
      variants
      options
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

export const DELETE_MERCH_PRODUCT = gql`
  mutation DeleteMerchProduct($id: ID!) {
    deleteMerchProduct(id: $id)
  }
`

export const CREATE_MERCH_CATEGORY = gql`
  mutation CreateMerchCategory($input: CreateMerchCategoryInput!) {
    createMerchCategory(input: $input) {
      id
      name
      slug
      description
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_MERCH_CATEGORY = gql`
  mutation UpdateMerchCategory($id: ID!, $input: UpdateMerchCategoryInput!) {
    updateMerchCategory(id: $id, input: $input) {
      id
      name
      slug
      description
      createdAt
      updatedAt
    }
  }
`

export const DELETE_MERCH_CATEGORY = gql`
  mutation DeleteMerchCategory($id: ID!) {
    deleteMerchCategory(id: $id)
  }
`

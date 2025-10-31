import { gql } from '@apollo/client'

export const GET_TENANTS = gql`
  query GetTenants {
    tenants {
      id
      name
      slug
      domain
      isActive
      status
      plan
      createdAt
      updatedAt
    }
  }
`

export const GET_TENANT_BY_ID = gql`
  query GetTenantById($id: ID!) {
    tenantById(id: $id) {
      id
      name
      slug
      domain
      isActive
      status
      plan
      createdAt
      updatedAt
    }
  }
`

export const GET_TENANT_BY_SLUG = gql`
  query GetTenantBySlug($slug: String!) {
    tenantBySlug(slug: $slug) {
      id
      name
      slug
      domain
      isActive
      status
      plan
      createdAt
      updatedAt
    }
  }
`

import { gql } from '@apollo/client'
import { TENANT_FIELDS } from '../fragments/tenant'

export const GET_TENANTS = gql`
  ${TENANT_FIELDS}
  query GetTenants {
    tenants {
      ...TenantFields
    }
  }
`

export const GET_TENANT_BY_ID = gql`
  ${TENANT_FIELDS}
  query GetTenantById($id: ID!) {
    getTenantById(id: $id) {
      ...TenantFields
    }
  }
`

export const GET_TENANT_BY_SLUG = gql`
  ${TENANT_FIELDS}
  query GetTenantBySlug($slug: String!) {
    getTenantBySlug(slug: $slug) {
      ...TenantFields
    }
  }
`

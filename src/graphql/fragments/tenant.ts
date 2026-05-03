import { gql } from '@apollo/client'

export const TENANT_FIELDS = gql`
  fragment TenantFields on Tenant {
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
`

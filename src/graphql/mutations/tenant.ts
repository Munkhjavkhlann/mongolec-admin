import { gql } from '@apollo/client'
import { TENANT_FIELDS } from '../fragments/tenant'

export const CREATE_TENANT = gql`
  ${TENANT_FIELDS}
  mutation CreateTenant($input: CreateTenantInput!) {
    createTenant(input: $input) {
      ...TenantFields
    }
  }
`

export const UPDATE_TENANT = gql`
  ${TENANT_FIELDS}
  mutation UpdateTenant($id: ID!, $input: UpdateTenantInput!) {
    updateTenant(id: $id, input: $input) {
      ...TenantFields
    }
  }
`

export const DELETE_TENANT = gql`
  mutation DeleteTenant($id: ID!) {
    deleteTenant(id: $id)
  }
`

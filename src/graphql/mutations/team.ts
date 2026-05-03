import { gql } from '@apollo/client'

export const CREATE_TEAM_MEMBER = gql`
  mutation CreateTeamMember($data: TeamMemberCreateInput!) {
    createTeamMember(data: $data) {
      id
      tenantId
      name
      role
      bio
      photo
      displayOrder
      isActive
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_TEAM_MEMBER = gql`
  mutation UpdateTeamMember($id: ID!, $data: TeamMemberUpdateInput!) {
    updateTeamMember(id: $id, data: $data) {
      id
      tenantId
      name
      role
      bio
      photo
      displayOrder
      isActive
      createdAt
      updatedAt
    }
  }
`

export const DELETE_TEAM_MEMBER = gql`
  mutation DeleteTeamMember($id: ID!) {
    deleteTeamMember(id: $id) {
      success
      message
    }
  }
`

export const REORDER_TEAM_MEMBERS = gql`
  mutation ReorderTeamMembers($ids: [ID!]!) {
    reorderTeamMembers(ids: $ids) {
      id
      displayOrder
      updatedAt
    }
  }
`

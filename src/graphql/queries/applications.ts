import { gql } from '@apollo/client'

export const GET_APPLICATIONS = gql`
  query GetApplications(
    $status: ApplicationStatus
    $rallyId: ID
    $limit: Int
    $offset: Int
  ) {
    applications(
      status: $status
      rallyId: $rallyId
      limit: $limit
      offset: $offset
    ) {
      applications {
        id
        rally {
          id
          title
          slug
          startDate
          endDate
        }
        status
        isRider
        hasMotorcycleLicense
        ridingExperience
        firstName
        lastName
        email
        phone
        country
        city
        address
        birthdate
        isMedicalProfessional
        medicalConditions
        dietaryRestrictions
        emergencyContactFirstName
        emergencyContactLastName
        emergencyContactPhone
        emergencyContactEmail
        emergencyContactRelationship
        motivation
        travelExperience
        futureLocations
        depositPaid
        depositAmount
        fullyPaid
        totalAmount
        reviewedBy
        reviewedAt
        createdAt
        updatedAt
      }
      pagination {
        total
        totalPages
        currentPage
        perPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    applicationById(id: $id) {
      id
      rally {
        id
        title
        slug
        startDate
        endDate
        location
        maxParticipants
        currentParticipants
      }
      status
      isRider
      hasMotorcycleLicense
      ridingExperience
      firstName
      lastName
      email
      phone
      country
      city
      address
      birthdate
      isMedicalProfessional
      medicalConditions
      dietaryRestrictions
      emergencyContactFirstName
      emergencyContactLastName
      emergencyContactPhone
      emergencyContactEmail
      emergencyContactRelationship
      motivation
      travelExperience
      futureLocations
      depositPaid
      depositAmount
      fullyPaid
      totalAmount
      reviewedBy
      reviewedAt
      createdAt
      updatedAt
    }
  }
`

export const GET_APPLICATION_STATS = gql`
  query GetApplicationStats {
    applicationStats {
      total
      pending
      underReview
      approved
      waitlisted
      rejected
      cancelled
      confirmed
    }
  }
`

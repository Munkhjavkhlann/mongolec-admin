'use client'

import { useQuery } from '@apollo/client/react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2,
  ArrowLeft,
  User,
  Bike,
  Heart,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { GET_APPLICATION } from '@/graphql/queries/applications'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
  ApproveButton,
  RejectButton,
  WaitlistButton,
  ConfirmButton,
  UpdatePaymentStatusButton,
} from '@/features/applications/components/application-actions'
import { applicationStatusConfig, paymentStatusConfig } from '@/features/applications/types'

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const { data, loading, error, refetch } = useQuery(GET_APPLICATION, {
    variables: { id: applicationId },
    fetchPolicy: 'cache-and-network',
  })

  const application = data?.applicationById

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDisplayName = (field: string | { en: string; mn: string } | undefined): string => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field.en || field.mn || ''
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading application...</span>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Application not found'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href="/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
      </div>
    )
  }

  const statusKey = application.status as keyof typeof applicationStatusConfig
  const statusConf = applicationStatusConfig[statusKey]

  // Derive payment status from depositPaid and fullyPaid fields
  const getPaymentStatus = () => {
    if (application.fullyPaid) return 'FULLY_PAID'
    if (application.depositPaid) return 'DEPOSIT_PAID'
    return 'PENDING'
  }

  const paymentKey = getPaymentStatus() as keyof typeof paymentStatusConfig
  const paymentConf = paymentStatusConfig[paymentKey]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {application.firstName} {application.lastName}
            </h1>
            <p className="text-muted-foreground">{application.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusConf.variant} className={statusConf.color}>
            {statusConf.label}
          </Badge>
          <Badge variant={paymentConf.variant} className={paymentConf.color}>
            {paymentConf.label}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Review and update application status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {application.status === 'PENDING' && (
              <>
                <ApproveButton
                  applicationId={application.id}
                  status={application.status}
                  onActionComplete={() => refetch()}
                />
                <RejectButton
                  applicationId={application.id}
                  status={application.status}
                  onActionComplete={() => refetch()}
                />
                <WaitlistButton
                  applicationId={application.id}
                  status={application.status}
                  onActionComplete={() => refetch()}
                />
              </>
            )}
            {application.status === 'APPROVED' && (
              <ConfirmButton
                applicationId={application.id}
                status={application.status}
                onActionComplete={() => refetch()}
              />
            )}
            <UpdatePaymentStatusButton
              applicationId={application.id}
              status={application.status}
              currentStatus={getPaymentStatus()}
              onActionComplete={() => refetch()}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="text-lg">
                    {application.firstName} {application.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{application.email}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{application.phone}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Birthdate</div>
                  <div>{formatDate(application.birthdate)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Country</div>
                  <div>{application.country}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">City</div>
                  <div>{application.city}</div>
                </div>
              </div>
              {application.address && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div>{application.address}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participation Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {application.isRider ? (
                  <Bike className="h-5 w-5" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
                Participation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {application.isRider ? (
                  <>
                    <Bike className="h-5 w-5 text-blue-500" />
                    <span className="text-lg font-medium">Rider</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 text-pink-500" />
                    <span className="text-lg font-medium">Supporter</span>
                  </>
                )}
              </div>

              {application.isRider && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Motorcycle License
                      </div>
                      <div className="flex items-center gap-2">
                        {application.hasMotorcycleLicense ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{application.hasMotorcycleLicense ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Riding Experience
                      </div>
                      <div>{application.ridingExperience || 'Not specified'}</div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Medical Professional
                  </div>
                  <div className="flex items-center gap-2">
                    {application.isMedicalProfessional ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span>{application.isMedicalProfessional ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              {application.medicalConditions && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Medical Conditions
                  </div>
                  <div>{application.medicalConditions}</div>
                </div>
              )}
              {application.dietaryRestrictions && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Dietary Restrictions
                  </div>
                  <div>{application.dietaryRestrictions}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="text-lg">{application.emergencyContactFirstName} {application.emergencyContactLastName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Relationship</div>
                  <div>{application.emergencyContactRelationship}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Phone</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{application.emergencyContactPhone}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{application.emergencyContactEmail}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Responses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {application.motivation && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Motivation</div>
                  <div className="mt-1 whitespace-pre-wrap">{application.motivation}</div>
                </div>
              )}
              {application.travelExperience && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Travel Experience
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{application.travelExperience}</div>
                </div>
              )}
              {application.futureLocations && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Future Locations of Interest
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{application.futureLocations}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rally Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Selected Rally
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Rally</div>
                <div className="text-lg font-medium">
                  {getDisplayName(application.rally?.title)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Location</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{getDisplayName(application.rally?.location)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(application.rally?.startDate)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">End Date</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(application.rally?.endDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Deposit Paid</div>
                <div className="flex items-center gap-2">
                  {application.depositPaid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>{application.depositPaid ? 'Yes' : 'No'}</span>
                </div>
              </div>
              {application.depositAmount && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Deposit Amount
                  </div>
                  <div className="text-lg">${application.depositAmount}</div>
                </div>
              )}
              {application.totalAmount && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                  <div className="text-lg">${application.totalAmount}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Applied On
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(application.createdAt)}</span>
                </div>
              </div>
              {application.reviewedAt && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Reviewed On
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(application.reviewedAt)}</span>
                  </div>
                </div>
              )}
              {application.reviewedBy && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Reviewed By
                  </div>
                  <div>{application.reviewedBy}</div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

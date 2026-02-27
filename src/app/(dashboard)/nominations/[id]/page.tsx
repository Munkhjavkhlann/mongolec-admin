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
  MapPin,
  Globe,
  Mail,
  Phone,
  Building,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
} from 'lucide-react'
import { GET_NOMINATION } from '@/graphql/queries/nominations'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import {
  ApproveButton,
  RejectButton,
  SelectButton,
} from '@/features/nominations/components/nomination-actions'
import { nominationStatusConfig } from '@/features/nominations/types'

export default function NominationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const nominationId = params.id as string

  const { data, loading, error, refetch } = useQuery(GET_NOMINATION, {
    variables: { id: nominationId },
    fetchPolicy: 'cache-and-network',
  })

  const nomination = data?.nominationById

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading nomination...</span>
        </div>
      </div>
    )
  }

  if (error || !nomination) {
    return (
      <div className="space-y-6 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Nomination not found'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href="/nominations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Nominations
          </Link>
        </Button>
      </div>
    )
  }

  const statusKey = nomination.status as keyof typeof nominationStatusConfig
  const statusConf = nominationStatusConfig[statusKey]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/nominations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {nomination.parkName}
            </h1>
            <p className="text-muted-foreground">{nomination.country}</p>
          </div>
        </div>
        <Badge variant={statusConf.variant} className={statusConf.color}>
          {statusConf.label}
        </Badge>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Review and update nomination status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(nomination.status === 'PENDING' || nomination.status === 'UNDER_REVIEW') && (
              <>
                <ApproveButton
                  nominationId={nomination.id}
                  status={nomination.status}
                  onActionComplete={() => refetch()}
                />
                <RejectButton
                  nominationId={nomination.id}
                  status={nomination.status}
                  onActionComplete={() => refetch()}
                />
              </>
            )}
            {nomination.status === 'APPROVED' && (
              <SelectButton
                nominationId={nomination.id}
                status={nomination.status}
                onActionComplete={() => refetch()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="space-y-6 lg:col-span-2">
          {/* Park Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Park Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Park Name</div>
                <div className="text-lg font-medium">{nomination.parkName}</div>
              </div>
              {nomination.parkWebsite && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Website</div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={nomination.parkWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {nomination.parkWebsite}
                    </a>
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-muted-foreground">Country</div>
                <div className="text-lg">{nomination.country}</div>
              </div>
            </CardContent>
          </Card>

          {/* Park Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Park Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nomination.parkContactName && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Contact Name</div>
                  <div className="text-lg">{nomination.parkContactName}</div>
                </div>
              )}
              {nomination.parkContactEmail && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${nomination.parkContactEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {nomination.parkContactEmail}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partner Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Partner Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nomination.partnerOrganization && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Organization</div>
                  <div className="text-lg font-medium">{nomination.partnerOrganization}</div>
                </div>
              )}
              {nomination.partnerContactPerson && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
                  <div>{nomination.partnerContactPerson}</div>
                </div>
              )}
              {nomination.partnerContactEmail && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${nomination.partnerContactEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {nomination.partnerContactEmail}
                    </a>
                  </div>
                </div>
              )}
              {nomination.partnerWebsite && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Website</div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={nomination.partnerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {nomination.partnerWebsite}
                    </a>
                  </div>
                </div>
              )}
              {nomination.partnerAddress && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="whitespace-pre-wrap">{nomination.partnerAddress}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mission & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mission & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {nomination.primaryMission && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Primary Mission</div>
                  <div className="mt-1 whitespace-pre-wrap">{nomination.primaryMission}</div>
                </div>
              )}
              {nomination.motorcycleSupport && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Motorcycle Support
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{nomination.motorcycleSupport}</div>
                </div>
              )}
              {nomination.logisticsSupport && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Logistics Support
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{nomination.logisticsSupport}</div>
                </div>
              )}
              {nomination.additionalInfo && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Additional Information
                  </div>
                  <div className="mt-1 whitespace-pre-wrap">{nomination.additionalInfo}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle>Nomination Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {nomination.status === 'APPROVED' || nomination.status === 'SELECTED' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : nomination.status === 'REJECTED' || nomination.status === 'NOT_SELECTED' ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-500" />
                )}
                <span className="font-medium">{statusConf.label}</span>
              </div>
              {nomination.selectedForRallyId && (
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-purple-500" />
                  <span>Selected for Rally ID: {nomination.selectedForRallyId}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nomination Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Nomination Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Nominated On
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(nomination.createdAt)}</span>
                </div>
              </div>
              {nomination.reviewedAt && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Reviewed On
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(nomination.reviewedAt)}</span>
                  </div>
                </div>
              )}
              {nomination.reviewedBy && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Reviewed By
                  </div>
                  <div>{nomination.reviewedBy}</div>
                </div>
              )}
              {nomination.submittedBy && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Submitted By
                  </div>
                  <div>{nomination.submittedBy}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Notes */}
          {nomination.reviewNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Review Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">
                  {nomination.reviewNotes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

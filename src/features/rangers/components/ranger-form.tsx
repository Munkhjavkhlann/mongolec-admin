'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { CREATE_PARK_PARTNERSHIP, UPDATE_PARK_PARTNERSHIP } from '@/graphql/mutations/rangers'
import { FormSection } from '@/components/admin'
import type { ParkPartnership } from '../types'

interface RangerFormProps {
  mode: 'create' | 'edit'
  language: 'en' | 'mn'
  initialData?: ParkPartnership
  rangerId?: string
}

const normalizeLangField = (field: string | { en: string; mn: string } | undefined) => {
  if (!field) return { en: '', mn: '' }
  if (typeof field === 'string') return { en: field, mn: '' }
  return field
}

export function RangerForm({ mode, language, initialData, rangerId }: RangerFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    parkName: normalizeLangField(initialData?.parkName),
    country: initialData?.country || '',
    location: normalizeLangField(initialData?.location),
    establishedDate: initialData?.establishedDate || '',
    partnershipType: normalizeLangField(initialData?.partnershipType),
    rangersCount: initialData?.rangersCount?.toString() || '0',
    areaSize: normalizeLangField(initialData?.areaSize),
    keyChallenges: normalizeLangField(initialData?.keyChallenges),
    contactPerson: initialData?.contactPerson || '',
    contactEmail: initialData?.contactEmail || '',
    contactPhone: initialData?.contactPhone || '',
  })

  const [createPartnership, { loading: createLoading }] = useMutation(CREATE_PARK_PARTNERSHIP, {
    onCompleted: () => {
      toast.success('Park partner added successfully')
      router.push('/rangers')
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const [updatePartnership, { loading: updateLoading }] = useMutation(UPDATE_PARK_PARTNERSHIP, {
    onCompleted: () => {
      toast.success('Park partner updated successfully')
      router.push('/rangers')
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const loading = createLoading || updateLoading

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLangFieldChange = (field: string, value: string) => {
    setFormData((prev) => {
      const current = prev[field as keyof typeof prev] as { en: string; mn: string }
      return { ...prev, [field]: { ...current, [language]: value } }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.parkName.en.trim()) {
      setError('Park name (English) is required')
      return
    }
    if (!formData.country.trim()) {
      setError('Country is required')
      return
    }

    const input = {
      parkName: formData.parkName,
      country: formData.country,
      location: formData.location,
      establishedDate: formData.establishedDate || null,
      partnershipType: formData.partnershipType,
      rangersCount: parseInt(formData.rangersCount) || 0,
      areaSize: formData.areaSize.en || formData.areaSize.mn ? formData.areaSize : null,
      keyChallenges: formData.keyChallenges.en || formData.keyChallenges.mn ? formData.keyChallenges : null,
      contactPerson: formData.contactPerson || null,
      contactEmail: formData.contactEmail || null,
      contactPhone: formData.contactPhone || null,
    }

    if (mode === 'create') {
      createPartnership({ variables: { data: input } })
    } else if (rangerId) {
      updatePartnership({ variables: { id: rangerId, data: input } })
    }
  }

  const ph = (en: string, mn: string) => (language === 'en' ? en : mn)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormSection title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Park Name *</Label>
            <Input
              value={formData.parkName[language]}
              onChange={(e) => handleLangFieldChange('parkName', e.target.value)}
              placeholder={ph('Park name in English', 'Паркийн нэр')}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Country</Label>
            <Input
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Enter country"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Established Date</Label>
            <Input
              type="date"
              value={formData.establishedDate}
              onChange={(e) => handleInputChange('establishedDate', e.target.value)}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Location & Partnership">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              value={formData.location[language]}
              onChange={(e) => handleLangFieldChange('location', e.target.value)}
              placeholder={ph('Location in English', 'Байршил')}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Partnership Type</Label>
            <Input
              value={formData.partnershipType[language]}
              onChange={(e) => handleLangFieldChange('partnershipType', e.target.value)}
              placeholder={ph('E.g., National Park, Reserve', 'Түнш төрөл')}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Area & Rangers">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Area Size</Label>
            <Input
              value={formData.areaSize[language]}
              onChange={(e) => handleLangFieldChange('areaSize', e.target.value)}
              placeholder={ph('E.g., 50,000 km²', '50,000 км²')}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Number of Rangers</Label>
            <Input
              type="number"
              value={formData.rangersCount}
              onChange={(e) => handleInputChange('rangersCount', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <Label>Key Challenges</Label>
          <Textarea
            value={formData.keyChallenges[language]}
            onChange={(e) => handleLangFieldChange('keyChallenges', e.target.value)}
            placeholder={ph('Describe key challenges', 'Гол сорилтууд')}
            className="min-h-24"
          />
        </div>
      </FormSection>

      <FormSection title="Contact Person">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              placeholder="Contact person name"
              className="max-w-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="+976 ..."
            />
          </div>
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 py-4">
          <Button type="submit" disabled={loading} className="min-w-[160px]">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === 'create' ? 'Add Park Partner' : 'Save Changes'}
          </Button>
          <Link href="/rangers">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
    </form>
  )
}

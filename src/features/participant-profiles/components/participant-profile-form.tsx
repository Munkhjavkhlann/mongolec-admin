'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@apollo/client/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2, X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  CREATE_PARTICIPANT_PROFILE,
  UPDATE_PARTICIPANT_PROFILE,
} from '@/graphql/mutations/participant-profiles'
import { FormSection } from '@/components/admin'
import type { ParticipantProfile } from '../types'

interface ParticipantProfileFormProps {
  mode: 'create' | 'edit'
  initialData?: ParticipantProfile
  participantId?: string
}

export function ParticipantProfileForm({
  mode,
  initialData,
  participantId,
}: ParticipantProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [yearInput, setYearInput] = useState('')

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    photo: initialData?.photo ?? '',
    country: initialData?.country ?? '',
    bio: initialData?.bio ?? '',
    displayOrder: initialData?.displayOrder?.toString() ?? '0',
    isActive: initialData?.isActive ?? true,
    rallyYears: initialData?.rallyYears ?? [],
  })

  const [createParticipant, { loading: createLoading }] = useMutation(
    CREATE_PARTICIPANT_PROFILE,
    {
      onCompleted: () => {
        toast.success('Participant created successfully')
        router.push('/participant-profiles')
      },
      onError: (err) => {
        setError(err.message)
        toast.error(err.message)
      },
    },
  )

  const [updateParticipant, { loading: updateLoading }] = useMutation(
    UPDATE_PARTICIPANT_PROFILE,
    {
      onCompleted: () => {
        toast.success('Participant updated successfully')
        router.push('/participant-profiles')
      },
      onError: (err) => {
        setError(err.message)
        toast.error(err.message)
      },
    },
  )

  const loading = createLoading || updateLoading

  const handleChange = (field: string, value: string | boolean | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addYear = () => {
    const year = parseInt(yearInput)
    if (!year || year < 2000 || year > 2100) {
      toast.error('Enter a valid year (2000–2100)')
      return
    }
    if (formData.rallyYears.includes(year)) {
      toast.error('Year already added')
      return
    }
    handleChange('rallyYears', [...formData.rallyYears, year])
    setYearInput('')
  }

  const removeYear = (year: number) => {
    handleChange(
      'rallyYears',
      formData.rallyYears.filter((y) => y !== year),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.firstName.trim()) {
      setError('First name is required')
      return
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required')
      return
    }
    if (!formData.country.trim()) {
      setError('Country is required')
      return
    }

    const input: Record<string, unknown> = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      photo: formData.photo.trim() || null,
      country: formData.country.trim(),
      bio: formData.bio.trim() || null,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
      rallyYears: formData.rallyYears,
    }

    if (mode === 'create') {
      createParticipant({ variables: { input } })
    } else if (participantId) {
      updateParticipant({ variables: { id: participantId, input } })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormSection title="Basic Information" description="Name and country details">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Country <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="E.g., Mongolia"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => handleChange('displayOrder', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Photo">
        <div className="space-y-1.5">
          <Label>Photo URL</Label>
          <Input
            value={formData.photo}
            onChange={(e) => handleChange('photo', e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        {formData.photo && (
          <img
            src={formData.photo}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover border mt-2"
          />
        )}
      </FormSection>

      <FormSection title="Biography">
        <Textarea
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Enter biography"
          className="min-h-28"
        />
      </FormSection>

      <FormSection title="Rally Years" description="Years this participant attended a rally">
        <div className="flex gap-2">
          <Input
            type="number"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            placeholder="E.g., 2024"
            className="w-36"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addYear()
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addYear}>
            <Plus className="h-4 w-4 mr-1" />
            Add Year
          </Button>
        </div>
        {formData.rallyYears.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {[...formData.rallyYears]
              .sort((a, b) => a - b)
              .map((year) => (
                <span
                  key={year}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-sm font-medium"
                >
                  {year}
                  <button
                    type="button"
                    onClick={() => removeYear(year)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        )}
      </FormSection>

      <FormSection title="Settings">
        <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visible in the public participant listing
            </p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 py-4">
          <Button type="submit" disabled={loading} className="min-w-[160px]">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === 'create' ? 'Add Participant' : 'Save Changes'}
          </Button>
          <Link href="/participant-profiles">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </form>
  )
}

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
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { CREATE_RANGER_PROFILE, UPDATE_RANGER_PROFILE } from '@/graphql/mutations/ranger-profiles'
import { FormSection } from '@/components/admin'
import type { RangerProfile } from '../types'

interface RangerProfileFormProps {
  mode: 'create' | 'edit'
  initialData?: RangerProfile
  rangerId?: string
}

export function RangerProfileForm({ mode, initialData, rangerId }: RangerProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    photo: initialData?.photo ?? '',
    parkName: initialData?.parkName ?? '',
    country: initialData?.country ?? '',
    bio: initialData?.bio ?? '',
    displayOrder: initialData?.displayOrder?.toString() ?? '0',
    isActive: initialData?.isActive ?? true,
    rallyId: initialData?.rallyId ?? '',
  })

  const [createRanger, { loading: createLoading }] = useMutation(CREATE_RANGER_PROFILE, {
    onCompleted: () => {
      toast.success('Ranger created successfully')
      router.push('/ranger-profiles')
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const [updateRanger, { loading: updateLoading }] = useMutation(UPDATE_RANGER_PROFILE, {
    onCompleted: () => {
      toast.success('Ranger updated successfully')
      router.push('/ranger-profiles')
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const loading = createLoading || updateLoading

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }
    if (!formData.parkName.trim()) {
      setError('Park name is required')
      return
    }
    if (!formData.country.trim()) {
      setError('Country is required')
      return
    }

    const input: Record<string, unknown> = {
      name: formData.name.trim(),
      parkName: formData.parkName.trim(),
      country: formData.country.trim(),
      bio: formData.bio.trim() || null,
      photo: formData.photo.trim() || null,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
      rallyId: formData.rallyId.trim() || null,
    }

    if (mode === 'create') {
      createRanger({ variables: { input } })
    } else if (rangerId) {
      updateRanger({ variables: { id: rangerId, input } })
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

      <FormSection title="Basic Information" description="Name, park, and country details">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Park Name <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.parkName}
              onChange={(e) => handleChange('parkName', e.target.value)}
              placeholder="E.g., Hustai National Park"
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

        <div className="space-y-1.5">
          <Label>Rally ID</Label>
          <Input
            value={formData.rallyId}
            onChange={(e) => handleChange('rallyId', e.target.value)}
            placeholder="Optional rally association"
          />
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

      <FormSection title="Settings">
        <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">Visible in the public ranger listing</p>
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
            {mode === 'create' ? 'Add Ranger' : 'Save Changes'}
          </Button>
          <Link href="/ranger-profiles">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </form>
  )
}

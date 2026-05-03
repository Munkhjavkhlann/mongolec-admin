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
import { CREATE_TEAM_MEMBER, UPDATE_TEAM_MEMBER } from '@/graphql/mutations/team'
import { FormSection } from '@/components/admin'
import type { TeamMember } from '../types'

interface TeamMemberFormProps {
  mode: 'create' | 'edit'
  initialData?: TeamMember
  memberId?: string
}

export function TeamMemberForm({ mode, initialData, memberId }: TeamMemberFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
    photo: initialData?.photo || '',
    email: initialData?.email || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    twitterUrl: initialData?.twitterUrl || '',
    displayOrder: initialData?.displayOrder?.toString() || '0',
    isActive: initialData?.isActive ?? true,
    tenantId: initialData?.tenantId || '',
  })

  const [createMember, { loading: createLoading }] = useMutation(CREATE_TEAM_MEMBER, {
    onCompleted: () => {
      toast.success('Team member created successfully')
      router.push('/team')
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const [updateMember, { loading: updateLoading }] = useMutation(UPDATE_TEAM_MEMBER, {
    onCompleted: () => {
      toast.success('Team member updated successfully')
      router.push('/team')
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
    if (!formData.role.trim()) {
      setError('Role is required')
      return
    }

    const input: Record<string, unknown> = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      bio: formData.bio.trim() || null,
      photo: formData.photo.trim() || null,
      email: formData.email.trim() || null,
      linkedinUrl: formData.linkedinUrl.trim() || null,
      twitterUrl: formData.twitterUrl.trim() || null,
      displayOrder: parseInt(formData.displayOrder) || 0,
      isActive: formData.isActive,
    }
    if (formData.tenantId.trim()) {
      input.tenantId = formData.tenantId.trim()
    }

    if (mode === 'create') {
      createMember({ variables: { data: input } })
    } else if (memberId) {
      updateMember({ variables: { id: memberId, data: input } })
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

      <FormSection title="Basic Information" description="Name, role, and contact details">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name <span className="text-destructive">*</span></Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role / Title <span className="text-destructive">*</span></Label>
            <Input
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder="E.g., Executive Director"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@example.com"
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>LinkedIn URL</Label>
            <Input
              value={formData.linkedinUrl}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Twitter / X URL</Label>
            <Input
              value={formData.twitterUrl}
              onChange={(e) => handleChange('twitterUrl', e.target.value)}
              placeholder="https://twitter.com/..."
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

      <FormSection title="Settings">
        <div className="space-y-1.5">
          <Label>
            Tenant ID{' '}
            <span className="text-muted-foreground text-xs font-normal">(super admin only — leave blank for current tenant)</span>
          </Label>
          <Input
            value={formData.tenantId}
            onChange={(e) => handleChange('tenantId', e.target.value)}
            placeholder="e.g. cmh4hw7vl0001hc87f9vk5h6q"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-xs text-muted-foreground mt-0.5">Visible in the public team listing</p>
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
            {mode === 'create' ? 'Add Member' : 'Save Changes'}
          </Button>
          <Link href="/team">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>
    </form>
  )
}

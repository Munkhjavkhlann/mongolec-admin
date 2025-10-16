import { ContentSection } from '@/features/settings/components/content-section'
import { Button } from '@/components/ui/button'

export default function SettingsAccountPage() {
  return (
    <ContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and timezone.'
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Account settings form will be implemented here.
        </p>
        <Button>Save changes</Button>
      </div>
    </ContentSection>
  )
}

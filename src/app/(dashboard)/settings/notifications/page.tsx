import { ContentSection } from '@/features/settings/components/content-section'
import { Button } from '@/components/ui/button'

export default function SettingsNotificationsPage() {
  return (
    <ContentSection
      title='Notifications'
      desc='Configure how you receive notifications.'
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Notification settings form will be implemented here.
        </p>
        <Button>Save changes</Button>
      </div>
    </ContentSection>
  )
}

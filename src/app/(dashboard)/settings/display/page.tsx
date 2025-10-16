import { ContentSection } from '@/features/settings/components/content-section'
import { Button } from '@/components/ui/button'

export default function SettingsDisplayPage() {
  return (
    <ContentSection
      title='Display'
      desc='Turn items on or off to control what is displayed in the app.'
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Display settings form will be implemented here.
        </p>
        <Button>Save changes</Button>
      </div>
    </ContentSection>
  )
}

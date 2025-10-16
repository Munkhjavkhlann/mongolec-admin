import { ContentSection } from '@/features/settings/components/content-section'
import { Button } from '@/components/ui/button'

export default function SettingsAppearancePage() {
  return (
    <ContentSection
      title='Appearance'
      desc='Customize the appearance of the app. Automatically switch between day and night themes.'
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Appearance settings form will be implemented here.
        </p>
        <Button>Save changes</Button>
      </div>
    </ContentSection>
  )
}

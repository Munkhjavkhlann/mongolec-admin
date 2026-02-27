import { StoryForm } from '@/components/stories/story-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CreateStoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create Story</h2>
        <p className="text-muted-foreground">
          Create a new rally story, rider profile, or field moment.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Story Information</CardTitle>
          <CardDescription>
            Fill in the details for your new story. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryForm mode="create" />
        </CardContent>
      </Card>
    </div>
  )
}

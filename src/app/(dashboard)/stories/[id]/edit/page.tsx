import { StoryForm } from '@/components/stories/story-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getStoryById } from '@/features/stories'

interface EditStoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditStoryPage({ params }: EditStoryPageProps) {
  const { id } = await params
  const story = await getStoryById(id)

  if (!story) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Story not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Story</h2>
        <p className="text-muted-foreground">
          Edit and update the story details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Story Information</CardTitle>
          <CardDescription>
            Update the details for this story. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoryForm story={story} mode="edit" />
        </CardContent>
      </Card>
    </div>
  )
}

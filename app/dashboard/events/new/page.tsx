import { EventForm } from "@/components/dashboard/event-form"

export default function NewEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Nouvel événement</h1>
        <p className="text-foreground/60 mt-1">Créer un stage, marché ou exposition</p>
      </div>
      <EventForm mode="create" />
    </div>
  )
}


import { notFound } from "next/navigation"
import { format } from "date-fns"
import { prisma } from "@/lib/prisma"
import { EventForm } from "@/components/dashboard/event-form"

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) notFound()

  const defaultValues = {
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.type,
    startDate: format(event.startDate, "yyyy-MM-dd'T'HH:mm"),
    endDate: event.endDate ? format(event.endDate, "yyyy-MM-dd'T'HH:mm") : undefined,
    location: event.location ?? undefined,
    imageUrl: event.imageUrl ?? undefined,
    published: event.published,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Modifier l&apos;événement</h1>
        <p className="text-foreground/60 mt-1">{event.title}</p>
      </div>
      <EventForm mode="edit" defaultValues={defaultValues} />
    </div>
  )
}

export const dynamic = "force-dynamic"

import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { EventsTable } from "@/components/dashboard/events-table"

export default async function DashboardEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startDate: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Événements</h1>
          <p className="text-foreground/60 mt-1">{events.length} événement{events.length > 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new">
            <Plus className="size-4" />
            Nouvel événement
          </Link>
        </Button>
      </div>

      <EventsTable events={events} />
    </div>
  )
}

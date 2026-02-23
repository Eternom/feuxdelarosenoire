import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MapPin, CalendarDays } from "lucide-react"
import type { Event } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

const typeLabels: Record<string, string> = {
  STAGE: "Stage",
  MARCHE: "Marché",
  EXPOSITION: "Exposition",
  AUTRE: "Autre",
}

export function getPlaceholderImage(id: string) {
  const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  return `https://picsum.photos/seed/${seed}/800/600`
}

interface EventCardProps {
  event: Event
  size?: "small" | "medium" | "large" | "wide" | "tall"
}

export function EventCard({ event, size = "medium" }: EventCardProps) {
  const imageUrl = event.imageUrl || getPlaceholderImage(event.id)

  const imageHeight =
    size === "wide"  ? "aspect-[16/7]" :
    size === "large" ? "aspect-[4/3]"  :
    size === "tall"  ? "aspect-[3/4]"  :
    "aspect-video"

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative overflow-hidden rounded-base border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-200 flex flex-col bg-secondary-background h-full"
    >
      {/* Image */}
      <div className={`relative ${imageHeight} overflow-hidden shrink-0`}>
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge>{typeLabels[event.type] ?? event.type}</Badge>
        </div>
      </div>

      {/* Contenu — titre + date + lieu toujours visibles */}
      <div className="flex-1 p-4 space-y-2">
        <h3 className="font-heading text-base md:text-lg lg:text-xl leading-tight line-clamp-2">
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center gap-1.5 text-xs md:text-sm lg:text-base text-main font-heading">
            <CalendarDays className="size-3 md:size-3.5 lg:size-4 shrink-0" />
            <span>{format(new Date(event.startDate), "d MMM yyyy", { locale: fr })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5 text-xs md:text-sm lg:text-base text-foreground/60">
              <MapPin className="size-3 md:size-3.5 lg:size-4 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

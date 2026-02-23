
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDays, MapPin, ArrowLeft, Mail, Phone } from "lucide-react"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const typeLabels: Record<string, string> = {
  STAGE: "Stage",
  MARCHE: "Marché",
  EXPOSITION: "Exposition",
  AUTRE: "Autre",
}

function getPlaceholderImage(id: string) {
  const seed = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  return `https://picsum.photos/seed/${seed}/1200/600`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const event = await prisma.event.findFirst({ where: { id, published: true } })
  if (!event) return { title: "Événement introuvable" }
  return {
    title: `${event.title} — Feux de la Rose Noire`,
    description: event.description.slice(0, 160),
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [event, admin] = await Promise.all([
    prisma.event.findFirst({ where: { id, published: true } }),
    prisma.user.findFirst({
      where: { role: "admin" },
      select: { email: true, phone: true },
    }),
  ])

  if (!event) notFound()

  const imageUrl = event.imageUrl || getPlaceholderImage(event.id)

  return (
    <>
      <Navbar />
      <main>

        {/* Hero image pleine largeur */}
        <div className="relative aspect-4/3 sm:aspect-video md:aspect-auto md:h-95 overflow-hidden">
          {imageUrl.includes("uploads/") ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              unoptimized={true}
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/30" />

          {/* Bouton retour */}
          <div className="absolute top-4 left-4">
            <Button variant="neutral" size="sm" asChild>
              <Link href="/#evenements">
                <ArrowLeft className="size-4" />
                Retour
              </Link>
            </Button>
          </div>

          {/* Badge sur l'image */}
          <div className="absolute bottom-4 left-4">
            <Badge>{typeLabels[event.type] ?? event.type}</Badge>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

          {/* Titre + date + lieu */}
          <div className="space-y-3 border-b-2 border-border pb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm md:text-base lg:text-lg text-foreground/70">
                <CalendarDays className="size-4 md:size-5 shrink-0 text-main" />
                <span>
                  {format(new Date(event.startDate), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                  {event.endDate &&
                    ` — ${format(new Date(event.endDate), "d MMMM yyyy 'à' HH'h'mm", { locale: fr })}`}
                </span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm md:text-base lg:text-lg text-foreground/70">
                  <MapPin className="size-4 md:size-5 shrink-0 text-main" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="border-2 border-border rounded-base p-6 bg-secondary-background shadow-shadow">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap wrap-break-word">
              {event.description}
            </p>
          </div>

          {/* Bloc réservation */}
          {(admin?.email || admin?.phone) && (
            <div className="border-2 border-border rounded-base p-6 bg-secondary-background shadow-shadow space-y-4">
              <h2 className="font-heading text-xl md:text-2xl">Réservation</h2>
              <p className="text-sm md:text-base text-foreground/70">
                Les réservations se font uniquement par mail ou téléphone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {admin.email && (
                  <Button className="w-full sm:w-auto" asChild>
                    <a href={`mailto:${admin.email}?subject=Réservation — ${event.title}`}>
                      <Mail className="size-4" />
                      Réserver par mail
                    </a>
                  </Button>
                )}
                {admin.phone && (
                  <Button variant="neutral" className="w-full sm:w-auto" asChild>
                    <a href={`tel:${admin.phone}`}>
                      <Phone className="size-4" />
                      {admin.phone}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}

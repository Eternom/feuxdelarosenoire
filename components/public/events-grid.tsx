"use client"

import { useEffect, useRef, useState } from "react"
import type { Event } from "@prisma/client"
import { Search } from "lucide-react"
import { EventCard } from "@/components/public/event-card"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const MOSAIC_PATTERN = [
  { size: "wide",   col: "md:col-span-2", row: "md:row-span-1" },
  { size: "medium", col: "md:col-span-1", row: "md:row-span-1" },
  { size: "small",  col: "md:col-span-1", row: "md:row-span-1" },
  { size: "medium", col: "md:col-span-1", row: "md:row-span-1" },
  { size: "wide",   col: "md:col-span-2", row: "md:row-span-1" },
  { size: "medium", col: "md:col-span-1", row: "md:row-span-1" },
] as const

interface EventsGridProps {
  events: Event[]
}

export function EventsGrid({ events }: EventsGridProps) {
  const [query, setQuery] = useState("")

  const filtered = query.trim()
    ? events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()))
    : events

  return (
    <section id="evenements" className="py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-10">

        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge>Agenda</Badge>
              <h2 className="text-4xl md:text-5xl font-heading">Prochains événements</h2>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/50 pointer-events-none" />
              <Input
                type="search"
                placeholder="Rechercher un événement…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </ScrollReveal>

        {events.length === 0 ? (
          <ScrollReveal>
            <div className="border-2 border-border rounded-base p-16 text-center text-foreground/50 bg-secondary-background shadow-shadow">
              Aucun événement à venir pour le moment. Revenez bientôt&nbsp;!
            </div>
          </ScrollReveal>
        ) : filtered.length === 0 ? (
          <div className="border-2 border-border rounded-base p-16 text-center text-foreground/50 bg-secondary-background shadow-shadow">
            Aucun résultat pour &laquo;&nbsp;{query}&nbsp;&raquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((event, i) => {
              const pattern = MOSAIC_PATTERN[i % MOSAIC_PATTERN.length]
              return (
                <AnimatedCard
                  key={event.id}
                  className={`${pattern.col} ${pattern.row}`}
                  delay={i * 60}
                >
                  <EventCard event={event} size={pattern.size} />
                </AnimatedCard>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}

function AnimatedCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = "1"
            el.style.transform = "translateY(0)"
          }, delay)
          // Une fois visible, on arrête d'observer — pas de disparition
          observer.unobserve(el)
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(20px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  )
}

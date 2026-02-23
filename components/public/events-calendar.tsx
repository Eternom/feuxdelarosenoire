"use client"

import { useState } from "react"
import { format, startOfDay, eachDayOfInterval } from "date-fns"
import { fr } from "date-fns/locale"
import type { Event } from "@prisma/client"
import { Calendar } from "@/components/ui/calendar"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { Badge } from "@/components/ui/badge"

interface EventsCalendarProps {
  events: Event[]
}

export function EventsCalendar({ events }: EventsCalendarProps) {
  const [month, setMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)

  // Tous les jours couverts par chaque événement (startDate → endDate inclus)
  const eventDates = events.flatMap((e) => {
    const start = startOfDay(new Date(e.startDate))
    const end = e.endDate ? startOfDay(new Date(e.endDate)) : start
    return eachDayOfInterval({ start, end })
  })

  // Quand on clique un jour, on cherche les events dont la plage couvre ce jour
  const eventsOnDay = (day: Date) => {
    const normalizedDay = startOfDay(day)
    return events.filter((e) => {
      const start = startOfDay(new Date(e.startDate))
      const end = e.endDate ? startOfDay(new Date(e.endDate)) : start
      return normalizedDay >= start && normalizedDay <= end
    })
  }

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : []

  return (
    <section id="calendrier" className="py-20 px-4 bg-secondary-background border-y-2 border-border">
      <div className="max-w-5xl mx-auto space-y-10">

        <ScrollReveal>
          <div className="space-y-2">
            <Badge>Planning</Badge>
            <h2 className="text-4xl md:text-5xl font-heading">Calendrier</h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Calendrier */}
            <div className="border-2 border-border rounded-base p-3 bg-background shadow-shadow shrink-0 w-full md:w-auto">
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                month={month}
                onMonthChange={setMonth}
                locale={fr}
                modifiers={{ hasEvent: eventDates }}
                modifiersClassNames={{
                  hasEvent: "bg-main! text-main-foreground! font-heading rounded-base ring-2 ring-border",
                }}
                classNames={{
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:rounded-base",
                }}
              />
            </div>

            {/* Panneau latéral */}
            <div className="flex-1 md:min-h-65">
              {selectedDay ? (
                <div className="space-y-4">
                  <h3 className="font-heading text-xl border-b-2 border-border pb-3">
                    {format(selectedDay, "EEEE d MMMM yyyy", { locale: fr })}
                  </h3>
                  {selectedEvents.length === 0 ? (
                    <p className="text-foreground/50 text-sm italic">
                      Aucun événement ce jour-là.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {selectedEvents.map((event) => (
                        <li key={event.id}>
                          <a
                            href={`/events/${event.id}`}
                            className="block border-2 border-border rounded-base p-4 bg-background shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-200 space-y-1"
                          >
                            <p className="font-heading">{event.title}</p>
                            {event.location && (
                              <p className="text-xs text-foreground/50">{event.location}</p>
                            )}
                            <p className="text-xs text-main font-heading">Voir les détails →</p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col justify-center space-y-3 text-foreground/40">
                  <p className="text-4xl">📅</p>
                  <p className="text-sm">
                    Sélectionnez une date pour voir les événements.
                    <br />
                    Les <span className="text-main font-heading">cases colorées</span> indiquent les jours avec événement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}

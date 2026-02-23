export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/public/hero-section"
import { AboutSection } from "@/components/public/about-section"
import { MissionSection } from "@/components/public/mission-section"
import { ShopSection } from "@/components/public/shop-section"
import { ValuesSection } from "@/components/public/values-section"
import { EventsGrid } from "@/components/public/events-grid"
import { EventsCalendar } from "@/components/public/events-calendar"
import { CTASection } from "@/components/public/cta-section"
import { PartnersSection } from "@/components/public/partners-section"

export default async function HomePage() {
  const upcomingEvents = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
    take: 9,
  })

  const allPublishedEvents = await prisma.event.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
  })

  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  })

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MissionSection />
        <ShopSection />
        <ValuesSection />
        <EventsGrid events={upcomingEvents} />
        <EventsCalendar events={allPublishedEvents} />
        <PartnersSection partners={partners} />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

import type { Partner } from "@prisma/client"
import { ExternalLink } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { Badge } from "@/components/ui/badge"

interface PartnersSectionProps {
  partners: Partner[]
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  if (partners.length === 0) return null

  return (
    <section id="partenaires" className="py-20 px-4 border-y-2 border-border">
      <div className="max-w-5xl mx-auto space-y-12">

        <ScrollReveal>
          <div className="space-y-2">
            <Badge>Nos soutiens</Badge>
            <h2 className="text-4xl md:text-5xl font-heading">Nos partenaires</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {partners.map((partner) => (
            <ScrollReveal key={partner.id}>
              {partner.websiteUrl ? (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group block border-2 border-border rounded-base bg-secondary-background shadow-shadow p-4 flex flex-col items-center gap-3 transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  <PartnerLogo partner={partner} />
                  <div className="text-center">
                    <p className="font-heading text-xs md:text-sm lg:text-base leading-tight line-clamp-2">{partner.name}</p>
                    <ExternalLink className="size-3 text-main mx-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ) : (
                <div className="border-2 border-border rounded-base bg-secondary-background shadow-shadow p-4 flex flex-col items-center gap-3">
                  <PartnerLogo partner={partner} />
                  <p className="font-heading text-xs md:text-sm lg:text-base leading-tight text-center line-clamp-2">{partner.name}</p>
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}

function PartnerLogo({ partner }: { partner: Partner }) {
  if (partner.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={partner.logoUrl}
        alt={partner.name}
        className="h-12 w-full object-contain"
      />
    )
  }
  return (
    <div className="h-12 w-full flex items-center justify-center">
      <span className="font-heading text-sm md:text-base text-foreground/60 text-center leading-tight">{partner.name}</span>
    </div>
  )
}

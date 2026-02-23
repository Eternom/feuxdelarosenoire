import Image from "next/image"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    icon: "🔥",
    title: "Ateliers & Stages",
    text: "Des ateliers pratiques, des stages et des formations pour apprendre les savoir-faire de la forge, de la poterie et d'autres métiers anciens dans un cadre bienveillant et accessible.",
    image: "/gallery/forge-meuleuse-etincelles.webp",
    aspect: "9/16" as const,
  },
  {
    icon: "⚒️",
    title: "Marchés & Démonstrations",
    text: "Nous participons à des marchés d'artisans, des fêtes historiques et des festivals pour démontrer nos techniques en direct et partager notre passion avec le plus grand nombre.",
    image: "/gallery/stand-marche-feux-rose-noire.webp",
    aspect: "3/4" as const,
  },
  {
    icon: "🏛️",
    title: "Créations & Restauration",
    text: "Des projets de création monumentale et de restauration d'œuvres historiques — de la miniature forgée à la grande sculpture métal — pour préserver et célébrer notre patrimoine.",
    image: "/gallery/soudeur-sculpture-metal-geant.webp",
    aspect: "9/16" as const,
  },
  {
    icon: "🔧",
    title: "Repair Cafés & Low-tech",
    text: "Des repair cafés, des projets low-tech et des actions en faveur des circuits courts pour encourager une économie de la réparation, du réemploi et du savoir-faire local.",
    image: "/gallery/mur-outils-collection-atelier.webp",
    aspect: "16/9" as const,
  },
  {
    icon: "🤝",
    title: "Cohésion sociale",
    text: "Des activités d'échange intergénérationnel et interculturel, créant du lien autour de la pratique commune — parce que transmettre, c'est aussi se retrouver.",
    image: "/gallery/foyer-forge-demonstration.webp",
    aspect: "4/3" as const,
  },
]

const ROTATIONS = ["-2deg", "2.5deg", "-1.5deg", "2deg", "-2.5deg"]

export function MissionSection() {
  return (
    <section id="mission" className="py-20 px-4 bg-secondary-background border-y-2 border-border">
      <div className="max-w-5xl mx-auto space-y-12">

        <ScrollReveal>
          <div className="space-y-2">
            <Badge>Ce que nous faisons</Badge>
            <h2 className="text-4xl md:text-5xl font-heading">Notre mission</h2>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {activities.map((activity, i) => (
            <ScrollReveal key={activity.title}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

                {/* Bloc texte */}
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div className="border-2 border-border rounded-base p-6 bg-background shadow-shadow space-y-3 h-full">
                    <span className="text-3xl">{activity.icon}</span>
                    <h3 className="font-heading text-xl md:text-2xl lg:text-3xl">{activity.title}</h3>
                    <p className="text-sm md:text-base lg:text-lg text-foreground/70 leading-relaxed">{activity.text}</p>
                  </div>
                </div>

                {/* Polaroid image */}
                <div className={`flex justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <div style={{ transform: `rotate(${ROTATIONS[i]})` }}>
                    <div className="relative">
                      <div className="absolute inset-0 translate-x-0.75 translate-y-0.75 bg-border pointer-events-none" />
                      <div className="relative border-[3px] border-border bg-background p-1.5 pb-8 shadow-shadow w-56 sm:w-64">
                        <Image
                          src={activity.image}
                          alt=""
                          width={256}
                          height={192}
                          className="w-full object-cover block"
                          style={{ aspectRatio: activity.aspect }}
                          sizes="(max-width: 768px) 60vw, 256px"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}

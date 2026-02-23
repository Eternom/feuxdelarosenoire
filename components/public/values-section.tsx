import Image from "next/image"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { Badge } from "@/components/ui/badge"

const values = [
  {
    word: "Transmission",
    description: "Partager les connaissances et les gestes ancestraux pour qu'ils continuent de vivre à travers les générations futures. Chaque coup de marteau est une leçon.",
    image: "/gallery/frappe-ciseau-sur-enclume.webp",
    aspect: "16/9" as const,
    highlight: true,
  },
  {
    word: "Authenticité",
    description: "Respecter les techniques traditionnelles, leurs matériaux et leur contexte historique, sans compromis sur la qualité du geste et la rigueur du savoir-faire.",
    image: "/gallery/braise-charbon-rougeoyant.webp",
    aspect: "3/4" as const,
    highlight: false,
  },
  {
    word: "Durabilité",
    description: "Privilégier le local, le réparable, le naturel et le peu énergivore. Nos savoir-faire ancestraux sont des réponses concrètes et éprouvées aux défis de demain.",
    image: "/gallery/bols-poterie-impression-plantes.webp",
    aspect: "16/9" as const,
    highlight: false,
  },
  {
    word: "Cohésion sociale",
    description: "Créer du lien à travers la pratique, le partage et la découverte. L'atelier comme espace de rencontre entre les générations, les cultures et les savoir-faire.",
    image: "/gallery/stand-medieval-tentes.webp",
    aspect: "4/3" as const,
    highlight: false,
  },
  {
    word: "Accessibilité",
    description: "Rendre ces savoirs ouverts à toutes et à tous, sans condition de niveau ni d'origine. Chacun peut apprendre, contribuer et transmettre à son tour.",
    image: "/gallery/piece-forgee-marche.webp",
    aspect: "16/9" as const,
    highlight: false,
  },
]

const ROTATIONS = ["2deg", "-2.5deg", "1.5deg", "-2deg", "2.5deg"]

export function ValuesSection() {
  return (
    <section id="valeurs" className="py-20 px-4 border-y-2 border-border">
      <div className="max-w-5xl mx-auto space-y-12">

        <ScrollReveal>
          <div className="space-y-2">
            <Badge>Ce qui nous guide</Badge>
            <h2 className="text-4xl md:text-5xl font-heading">Nos valeurs</h2>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {values.map((value, i) => (
            <ScrollReveal key={value.word}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">

                {/* Bloc texte */}
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <div
                    className={`border-2 border-border rounded-base p-6 shadow-shadow space-y-3 h-full
                      ${value.highlight ? "bg-main text-main-foreground" : "bg-secondary-background"}`}
                  >
                    <h3 className={`font-heading text-2xl md:text-3xl lg:text-4xl ${value.highlight ? "" : ""}`}>
                      {value.word}
                    </h3>
                    <p className={`text-sm md:text-base lg:text-lg leading-relaxed ${value.highlight ? "opacity-80" : "text-foreground/70"}`}>
                      {value.description}
                    </p>
                  </div>
                </div>

                {/* Polaroid image */}
                <div className={`flex justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                  <div style={{ transform: `rotate(${ROTATIONS[i]})` }}>
                    <div className="relative">
                      <div className="absolute inset-0 translate-x-0.75 translate-y-0.75 bg-border pointer-events-none" />
                      <div className="relative border-[3px] border-border bg-secondary-background p-1.5 pb-8 shadow-shadow w-56 sm:w-64">
                        <Image
                          src={value.image}
                          alt=""
                          width={256}
                          height={192}
                          className="w-full object-cover block"
                          style={{ aspectRatio: value.aspect }}
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

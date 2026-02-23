import Image from "next/image"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { GalleryItem } from "@/components/public/gallery-item"
import { Badge } from "@/components/ui/badge"

const COLLAGE = [
  { src: "/gallery/forge-atelier-vue-ensemble.webp",  rotate: "-4deg", aspect: "4/3" as const, top: "0px",  left: "0px",   width: 220 },
  { src: "/gallery/soudeur-sculpture-metal-geant.webp", rotate: "3deg",  aspect: "9/16" as const, top: "60px", right: "0px",  width: 160 },
]

export function AboutSection() {
  return (
    <section id="apropos" className="py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">

        <ScrollReveal>
          <div className="space-y-2">
            <Badge>Qui sommes-nous</Badge>
            <h2 className="text-4xl md:text-5xl font-heading">À propos de nous</h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <div className="border-2 border-border rounded-base p-6 md:p-8 bg-secondary-background shadow-shadow space-y-5 text-foreground/80 leading-relaxed">
              <p>
                Bienvenue au cœur d&apos;une aventure dédiée aux savoirs anciens, aux métiers oubliés
                et au patrimoine vivant.
              </p>
              <p>
                Notre ASBL a pour mission de préserver, transmettre et faire rayonner les techniques
                artisanales qui ont façonné notre histoire&nbsp;: forge, poterie, verrerie, travail du
                bois, savoirs agricoles d&apos;antan, teintures végétales, et bien plus encore.
              </p>
              <p>
                Nous croyons profondément que ces savoir-faire, loin d&apos;être dépassés, sont porteurs
                de sens pour notre époque. Ils racontent l&apos;ingéniosité humaine, le respect des
                matériaux naturels, le lien au territoire et l&apos;importance du geste juste.
              </p>
              <p>
                En revalorisant ces métiers, nous souhaitons offrir à chacun la possibilité de
                réapprendre, expérimenter, comprendre et transmettre.
              </p>
            </div>
          </ScrollReveal>

          {/* Collage de polaroids */}
          <div className="relative h-85 hidden md:block">
            {COLLAGE.map((img, i) => (
              <GalleryItem key={img.src} delay={i * 120}>
                <div
                  className="absolute"
                  style={{
                    transform: `rotate(${img.rotate})`,
                    width: img.width,
                    top: img.top,
                    left: "left" in img ? img.left : undefined,
                    right: "right" in img ? img.right : undefined,
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 translate-x-0.75 translate-y-0.75 bg-border pointer-events-none" />
                    <div className="relative border-[3px] border-border bg-secondary-background p-1.5 pb-7 shadow-shadow">
                      <Image
                        src={img.src}
                        alt=""
                        width={img.width}
                        height={Math.round(img.width * 0.75)}
                        className="w-full object-cover block"
                        style={{ aspectRatio: img.aspect }}
                        sizes="220px"
                      />
                    </div>
                  </div>
                </div>
              </GalleryItem>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

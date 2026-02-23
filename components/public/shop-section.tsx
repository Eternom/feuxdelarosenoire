import Image from "next/image"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { GalleryItem } from "@/components/public/gallery-item"
import { Badge } from "@/components/ui/badge"

const SHOP_IMAGES = [
  { src: "/gallery/stand-marche-feux-rose-noire.webp", rotate: "-3deg",  aspect: "3/4" as const, width: 210 },
  { src: "/gallery/stand-poterie-exterieur.webp",       rotate: "2.5deg", aspect: "1/1" as const, width: 180 },
  { src: "/gallery/bols-poterie-impression-plantes.webp", rotate: "-1.5deg", aspect: "16/9" as const, width: 220 },
]

export function ShopSection() {
  return (
    <section id="echoppe" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="space-y-2 mb-10">
            <Badge>Notre boutique itinérante</Badge>
            <h2 className="text-4xl md:text-5xl font-heading">
              L&apos;échoppe au service de notre mission
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <div className="border-2 border-border rounded-base p-6 md:p-8 bg-secondary-background shadow-shadow space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  Notre échoppe mobile vous propose des créations artisanales, des pièces inspirées
                  de l&apos;histoire, des objets réalisés dans nos ateliers et des productions issues
                  de nos recherches.
                </p>
                <p>
                  Chaque achat soutient directement nos initiatives, nos actions pédagogiques et
                  la préservation de savoir-faire qui risqueraient autrement de disparaître.
                </p>
              </div>

              <div className="border-2 border-border rounded-base p-6 bg-main text-main-foreground shadow-shadow space-y-4">
                <h3 className="font-heading text-xl">Retrouvez-nous lors de :</h3>
                <ul className="space-y-2 text-sm font-base">
                  <li className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    Marchés d&apos;artisans &amp; foires
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    Fêtes historiques &amp; festivals
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    Événements associatifs &amp; culturels
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1">▸</span>
                    Nos ateliers sur rendez-vous
                  </li>
                </ul>
                <a
                  href="#calendrier"
                  className="inline-block mt-2 underline underline-offset-4 text-sm font-heading hover:opacity-80 transition-opacity"
                >
                  Voir le calendrier →
                </a>
              </div>
            </div>

            {/* Polaroids empilés */}
            <div className="flex flex-col gap-5 items-center pt-2">
              {SHOP_IMAGES.map((img, i) => (
                <GalleryItem key={img.src} delay={i * 100}>
                  <div style={{ transform: `rotate(${img.rotate})`, width: img.width }}>
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
                          sizes="(max-width: 768px) 60vw, 220px"
                        />
                      </div>
                    </div>
                  </div>
                </GalleryItem>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

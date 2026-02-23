import Image from "next/image"
import { ScrollReveal } from "@/components/public/scroll-reveal"

const HERO_IMAGES = [
  { src: "/gallery/abeille-rose-forgee-macro.webp", rotate: "-6deg", aspect: "1/1" as const,  width: 260, height: 260 },
  { src: "/gallery/dragon-metal-crache-feu.webp",   rotate: "5deg",  aspect: "16/9" as const, width: 280, height: 158 },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center px-6 py-16 md:py-24 overflow-hidden">
      {/* Grille décorative de fond */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 39px, oklch(0% 0 0) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, oklch(0% 0 0) 40px)",
        }}
      />

      {/* Grille 3 colonnes : image | contenu | image */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-8 items-center">

        {/* Polaroid gauche */}
        <div className="hidden lg:flex justify-end items-center">
          <ScrollReveal>
            <div style={{ transform: `rotate(${HERO_IMAGES[0].rotate})` }}>
              <div className="relative">
                <div className="absolute inset-0 translate-x-0.75 translate-y-0.75 bg-border pointer-events-none" />
                <div
                  className="relative border-[3px] border-border bg-secondary-background p-1.5 pb-7 shadow-shadow opacity-80 hover:opacity-100 transition-opacity duration-300"
                  style={{ width: HERO_IMAGES[0].width }}
                >
                  <Image
                    src={HERO_IMAGES[0].src}
                    alt=""
                    width={HERO_IMAGES[0].width}
                    height={HERO_IMAGES[0].height}
                    className="w-full object-cover block"
                    style={{ aspectRatio: HERO_IMAGES[0].aspect }}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Contenu central */}
        <div className="text-center space-y-6 md:space-y-8">
          <ScrollReveal>
            <div className="inline-block border-2 border-border px-4 py-1 text-sm md:text-base font-base bg-main text-main-foreground shadow-shadow rounded-base">
              ASBL · Forge &amp; Poterie · Savoir-faire ancestraux
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading leading-tight tracking-tight">
              Feux de la{" "}
              <span className="text-main relative inline-block">
                Rose Noire
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-main opacity-40" />
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal>
            <p className="text-base md:text-xl lg:text-2xl text-foreground/60 italic font-base leading-relaxed">
              Redonner vie aux savoir-faire d&apos;hier
              <br className="hidden sm:block" />
              pour construire le monde de demain.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <a
                href="#evenements"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-main text-main-foreground font-heading text-sm md:text-base border-2 border-border shadow-shadow rounded-base hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-200"
              >
                Voir les événements
              </a>
              <a
                href="#apropos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-background text-foreground font-heading text-sm md:text-base border-2 border-border shadow-shadow rounded-base hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-200"
              >
                En savoir plus
              </a>
            </div>
          </ScrollReveal>

          {/* Strip polaroids mobile uniquement */}
          <div className="flex lg:hidden justify-center gap-8 pt-2">
            {HERO_IMAGES.map((img) => (
              <div key={img.src} style={{ transform: `rotate(${img.rotate})` }}>
                <div className="relative">
                  <div className="absolute inset-0 translate-x-0.75 translate-y-0.75 bg-border pointer-events-none" />
                  <div className="relative border-[3px] border-border bg-secondary-background p-1.5 pb-5 shadow-shadow opacity-80">
                    <Image
                      src={img.src}
                      alt=""
                      width={110}
                      height={110}
                      className="w-full object-cover block"
                      style={{ aspectRatio: img.aspect, width: 110 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Polaroid droit */}
        <div className="hidden lg:flex justify-start items-center">
          <ScrollReveal>
            <div style={{ transform: `rotate(${HERO_IMAGES[1].rotate})` }}>
              <div className="relative">
                <div className="absolute inset-0 translate-x-0.75 translate-y-0.75 bg-border pointer-events-none" />
                <div
                  className="relative border-[3px] border-border bg-secondary-background p-1.5 pb-7 shadow-shadow opacity-70 hover:opacity-100 transition-opacity duration-300"
                  style={{ width: HERO_IMAGES[1].width }}
                >
                  <Image
                    src={HERO_IMAGES[1].src}
                    alt=""
                    width={HERO_IMAGES[1].width}
                    height={HERO_IMAGES[1].height}
                    className="w-full object-cover block"
                    style={{ aspectRatio: HERO_IMAGES[1].aspect }}
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* Flèche de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  )
}

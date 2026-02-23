import { Mail, Phone } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { Badge } from "@/components/ui/badge"

export async function CTASection() {
  const admin =
    (await prisma.user.findFirst({
      where: { role: "admin" },
      orderBy: { createdAt: "asc" },
      select: { name: true, email: true, phone: true },
    })) ??
    (await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
      select: { name: true, email: true, phone: true },
    }))

  const contacts = admin
    ? [
        ...(admin.phone
          ? [{ icon: Phone, label: "Téléphone", value: admin.phone, href: `tel:${admin.phone}` }]
          : []),
        ...(admin.email
          ? [{ icon: Mail, label: "Email", value: admin.email, href: `mailto:${admin.email}` }]
          : []),
      ]
    : []

  return (
    <section id="contact" className="py-24 px-4 bg-main">
      <div className="max-w-3xl mx-auto text-center space-y-8">

        <ScrollReveal>
          <Badge variant="neutral">Prenez contact</Badge>
          <h2 className="text-4xl md:text-5xl font-heading text-main-foreground mt-2">
            Venez nous rencontrer
          </h2>
          <p className="text-main-foreground/80 text-lg leading-relaxed mt-4">
            Une question sur nos stages, nos marchés, ou simplement envie d&apos;en savoir plus&nbsp;?
            <br />
            Appelez-nous directement — nous serons ravis d&apos;échanger avec vous.
          </p>
        </ScrollReveal>

        {contacts.length > 0 ? (
          <ScrollReveal stagger>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-6 py-4 bg-main-foreground text-foreground font-heading rounded-base border-2 border-main-foreground/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-200 min-w-55"
                >
                  <Icon className="size-5 shrink-0 text-main" />
                  <div className="text-left">
                    <p className="text-xs opacity-60 font-base">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="border-2 border-main-foreground/30 rounded-base px-6 py-4 inline-block text-main-foreground/70 text-sm">
              Coordonnées disponibles prochainement.
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  )
}

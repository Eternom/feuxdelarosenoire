import { prisma } from "@/lib/prisma"
import { Mail, Phone, MapPin } from "lucide-react"

export async function Footer() {
  const admin =
    (await prisma.user.findFirst({
      where: { role: "admin" },
      orderBy: { createdAt: "asc" },
      select: { email: true, phone: true, address: true, country: true },
    })) ??
    (await prisma.user.findFirst({
      orderBy: { createdAt: "asc" },
      select: { email: true, phone: true, address: true, country: true },
    }))

  return (
    <footer className="border-t-2 border-border bg-secondary-background pb-20 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-2">
          <h2 className="font-heading text-xl md:text-2xl mb-1">Feux de la Rose Noire</h2>
          <p className="text-sm md:text-base text-foreground/50 italic">
            Redonner vie aux savoir-faire d&apos;hier pour construire le monde de demain.
          </p>
        </div>

        <div className="space-y-2">
          {admin?.email && (
            <a href={`mailto:${admin.email}`} className="flex items-center gap-2 text-sm md:text-base hover:text-main transition-colors duration-200">
              <Mail className="size-4 shrink-0 text-main" />
              {admin.email}
            </a>
          )}
          {admin?.phone && (
            <a href={`tel:${admin.phone}`} className="flex items-center gap-2 text-sm md:text-base hover:text-main transition-colors duration-200">
              <Phone className="size-4 shrink-0 text-main" />
              {admin.phone}
            </a>
          )}
          {admin?.address && (
            <p className="flex items-start gap-2 text-sm md:text-base text-foreground/50">
              <MapPin className="size-4 shrink-0 text-main mt-0.5" />
              {admin.address}{admin.country ? `, ${admin.country}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border/20 py-4 text-center text-xs md:text-sm text-foreground/25">
        © {new Date().getFullYear()} Feux de la Rose Noire — ASBL
      </div>
    </footer>
  )
}

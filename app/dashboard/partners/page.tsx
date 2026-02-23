import Link from "next/link"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { PartnersTable } from "@/components/dashboard/partners-table"

export default async function DashboardPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Partenaires</h1>
          <p className="text-foreground/60 mt-1">{partners.length} partenaire{partners.length > 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/partners/new">
            <Plus className="size-4" />
            Nouveau partenaire
          </Link>
        </Button>
      </div>

      <PartnersTable partners={partners} />
    </div>
  )
}

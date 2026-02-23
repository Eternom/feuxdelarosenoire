export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const [total, published, byType] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { published: true } }),
    prisma.event.groupBy({ by: ["type"], _count: { _all: true } }),
  ])

  const typeLabels: Record<string, string> = {
    STAGE: "Stages",
    MARCHE: "Marchés",
    EXPOSITION: "Expositions",
    AUTRE: "Autres",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Tableau de bord</h1>
        <p className="text-foreground/60 mt-1">Vue d&apos;ensemble des événements</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-base text-foreground/60">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-heading">{total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-base text-foreground/60">Publiés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-heading text-main">{published}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-base text-foreground/60">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-heading">{total - published}</p>
          </CardContent>
        </Card>

        {byType.map((t) => (
          <Card key={t.type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-base text-foreground/60">
                {typeLabels[t.type] ?? t.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-heading">{t._count._all}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PartnerForm } from "@/components/dashboard/partner-form"

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) notFound()

  const defaultValues = {
    id: partner.id,
    name: partner.name,
    logoUrl: partner.logoUrl ?? undefined,
    websiteUrl: partner.websiteUrl ?? undefined,
    description: partner.description ?? undefined,
    order: partner.order,
    published: partner.published,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Modifier le partenaire</h1>
        <p className="text-foreground/60 mt-1">{partner.name}</p>
      </div>
      <PartnerForm mode="edit" defaultValues={defaultValues} />
    </div>
  )
}

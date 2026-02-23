import { PartnerForm } from "@/components/dashboard/partner-form"

export default function NewPartnerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Nouveau partenaire</h1>
        <p className="text-foreground/60 mt-1">Ajouter un soutien ou partenaire de l&apos;atelier</p>
      </div>
      <PartnerForm mode="create" />
    </div>
  )
}

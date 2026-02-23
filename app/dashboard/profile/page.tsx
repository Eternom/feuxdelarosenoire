import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/dashboard/profile-form"

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: { name: true, email: true, phone: true, address: true, country: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading">Profil</h1>
        <p className="text-foreground/60 mt-1">
          Ces informations sont affichées sur le site public pour les réservations.
        </p>
      </div>
      <ProfileForm
        defaultValues={{
          name: user?.name ?? "",
          email: user?.email ?? "",
          phone: user?.phone ?? "",
          address: user?.address ?? "",
          country: user?.country ?? "",
        }}
      />
    </div>
  )
}

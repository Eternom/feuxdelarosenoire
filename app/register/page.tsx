
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { RegisterForm } from "@/components/auth/register-form"

export default async function RegisterPage() {
  // Protection one-shot : si un admin existe déjà, bloquer l'accès
  const count = await prisma.user.count()
  if (count > 0) redirect("/login")

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading">Feux de la Rose Noire</h1>
          <p className="text-foreground/60">Création du compte administrateur</p>
        </div>
        <div className="border-2 border-border rounded-base p-6 bg-secondary-background shadow-shadow">
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}

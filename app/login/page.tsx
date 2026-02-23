import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { LoginForm } from "@/components/auth/login-form"

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect("/dashboard")

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading">Feux de la Rose Noire</h1>
          <p className="text-foreground/60">Espace administration</p>
        </div>
        <div className="border-2 border-border rounded-base p-6 bg-secondary-background shadow-shadow">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}

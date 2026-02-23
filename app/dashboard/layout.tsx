import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto pb-24 md:pb-8">{children}</main>
    </div>
  )
}

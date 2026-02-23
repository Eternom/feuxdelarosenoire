"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, Handshake, Images, LayoutDashboard, LogOut, User } from "lucide-react"
import { toast } from "sonner"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { href: "/dashboard",           label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/events",    label: "Événements",      icon: CalendarDays    },
  { href: "/dashboard/partners",  label: "Partenaires",     icon: Handshake       },
  { href: "/dashboard/media",     label: "Médias",          icon: Images          },
  { href: "/dashboard/profile",   label: "Profil",          icon: User            },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  const handleLogout = async () => {
    await signOut()
    toast.success("Déconnecté")
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* ── Mobile : header sticky + bottom nav ── */}
      <header className="md:hidden sticky top-0 z-40 border-b-2 border-border bg-secondary-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="font-heading text-base hover:text-main transition-colors">
            Feux de la Rose Noire
          </Link>
          <span className="text-xs text-foreground/50 font-heading uppercase tracking-wider">Admin</span>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t-2 border-border bg-secondary-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-heading transition-colors",
                isActive(href) ? "text-main" : "text-foreground/50 hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="leading-tight">{label === "Tableau de bord" ? "Accueil" : label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-heading text-foreground/50 hover:text-foreground transition-colors"
          >
            <LogOut className="size-5" />
            <span>Quitter</span>
          </button>
        </div>
      </nav>

      {/* ── Desktop : sidebar ── */}
      <aside className="hidden md:flex w-64 min-h-screen border-r-2 border-border bg-secondary-background flex-col shrink-0">
        <div className="p-4">
          <Link href="/" className="font-heading text-lg hover:text-main transition-colors">
            Feux de la Rose Noire
          </Link>
          <p className="text-xs text-foreground/50 mt-1">Administration</p>
        </div>

        <Separator />

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-base text-sm font-base transition-all border-2",
                  isActive(item.href)
                    ? "bg-main text-main-foreground border-border shadow-shadow"
                    : "border-transparent hover:border-border hover:bg-background"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4">
          <Separator className="mb-4" />
          <Button variant="neutral" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="size-4" />
            Se déconnecter
          </Button>
        </div>
      </aside>
    </>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutGrid, CalendarDays, Info, Phone } from "lucide-react"

const NAV_ITEMS = [
  { href: "/",            icon: Home,         label: "Accueil"     },
  { href: "/#evenements", icon: LayoutGrid,   label: "Événements"  },
  { href: "/#calendrier", icon: CalendarDays, label: "Calendrier"  },
  { href: "/#apropos",    icon: Info,         label: "À propos"    },
  { href: "/#contact",    icon: Phone,        label: "Contact"     },
]

export function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/register")) return null

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t-2 border-border bg-secondary-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center w-12 h-12 text-foreground/50 hover:text-main transition-colors duration-200"
            aria-label={label}
          >
            <Icon className="size-6" />
          </Link>
        ))}
      </div>
    </nav>
  )
}

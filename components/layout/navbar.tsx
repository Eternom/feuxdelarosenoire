"use client"

import Link from "next/link"
import { BookOpen, Hammer, LayoutGrid, CalendarDays, Phone } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/#apropos",    label: "L'histoire",  icon: BookOpen     },
  { href: "/#mission",    label: "Mission",     icon: Hammer       },
  { href: "/#evenements", label: "Événements",  icon: LayoutGrid   },
  { href: "/#calendrier", label: "Calendrier",  icon: CalendarDays },
  { href: "/#contact",    label: "Contact",     icon: Phone        },
]

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="border-b-2 border-border bg-secondary-background/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="relative max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo — gauche */}
        <Link
          href="/"
          className="font-heading text-lg md:text-xl lg:text-2xl hover:text-main transition-colors duration-200"
        >
          Feux de la Rose Noire
        </Link>

        {/* Nav — absolument centrée sur la largeur du header */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-base text-sm lg:text-base font-base text-foreground/70 hover:text-main hover:bg-main/10 transition-all duration-200"
            >
              <Icon className="size-5 shrink-0" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Action — droite */}
        <div>
          {session ? (
            <Button variant="noShadow" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button variant="neutral" size="sm" asChild>
              <Link href="/login">Admin</Link>
            </Button>
          )}
        </div>

      </div>
    </header>
  )
}

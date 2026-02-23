"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import type { Event } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const typeLabels: Record<string, string> = {
  STAGE: "Stage",
  MARCHE: "Marché",
  EXPOSITION: "Exposition",
  AUTRE: "Autre",
}

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const handleTogglePublish = async (event: Event) => {
    setLoading(event.id)
    try {
      await axios.put(`/api/admin/events/${event.id}`, {
        published: !event.published,
      })
      toast.success(event.published ? "Événement dépublié" : "Événement publié")
      router.refresh()
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await axios.delete(`/api/admin/events/${deleteId}`)
      toast.success("Événement supprimé")
      setDeleteId(null)
      router.refresh()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <>
      {/* ── Mobile : cartes ── */}
      <div className="md:hidden space-y-3">
        {events.length === 0 && (
          <div className="border-2 border-border rounded-base p-10 text-center text-foreground/50 bg-secondary-background">
            Aucun événement — créez le premier !
          </div>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className="border-2 border-border rounded-base bg-secondary-background shadow-shadow p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-heading text-sm leading-tight">{event.title}</p>
              {event.published ? (
                <Badge variant="neutral" className="shrink-0">Publié</Badge>
              ) : (
                <Badge variant="neutral" className="shrink-0">Brouillon</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/60">
              <Badge variant="neutral">{typeLabels[event.type] ?? event.type}</Badge>
              <span>{format(new Date(event.startDate), "d MMM yyyy", { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t-2 border-border">
              <Button
                size="sm"
                variant="neutral"
                className="flex-1 gap-1.5"
                onClick={() => handleTogglePublish(event)}
                disabled={loading === event.id}
              >
                {event.published ? <><EyeOff className="size-3.5" /> Dépublier</> : <><Eye className="size-3.5" /> Publier</>}
              </Button>
              <Button size="icon" variant="neutral" asChild>
                <Link href={`/dashboard/events/${event.id}/edit`}>
                  <Pencil className="size-4" />
                </Link>
              </Button>
              <Button size="icon" variant="neutral" onClick={() => setDeleteId(event.id)}>
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop : table ── */}
      <div className="hidden md:block border-2 border-border rounded-base overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/50 py-12">
                  Aucun événement — créez le premier !
                </TableCell>
              </TableRow>
            )}
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-base">{event.title}</TableCell>
                <TableCell>
                  <Badge variant="neutral">{typeLabels[event.type] ?? event.type}</Badge>
                </TableCell>
                <TableCell className="text-sm text-foreground/70">
                  {format(new Date(event.startDate), "d MMM yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  {event.published ? (
                    <Badge variant="neutral">Publié</Badge>
                  ) : (
                    <Badge variant="neutral">Brouillon</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={() => handleTogglePublish(event)}
                      disabled={loading === event.id}
                      title={event.published ? "Dépublier" : "Publier"}
                    >
                      {event.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button size="icon" variant="neutral" asChild>
                      <Link href={`/dashboard/events/${event.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={() => setDeleteId(event.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;événement</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L&apos;événement sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="neutral" onClick={() => setDeleteId(null)}>
              Annuler
            </Button>
            <Button onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

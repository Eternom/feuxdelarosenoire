"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react"
import type { Partner } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

interface PartnersTableProps {
  partners: Partner[]
}

export function PartnersTable({ partners }: PartnersTableProps) {
  const router   = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading,  setLoading]  = useState<string | null>(null)

  const handleTogglePublish = async (partner: Partner) => {
    setLoading(partner.id)
    try {
      await axios.put(`/api/admin/partners/${partner.id}`, { published: !partner.published })
      toast.success(partner.published ? "Partenaire masqué" : "Partenaire publié")
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
      await axios.delete(`/api/admin/partners/${deleteId}`)
      toast.success("Partenaire supprimé")
      setDeleteId(null)
      router.refresh()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  const empty = (
    <div className="border-2 border-border rounded-base p-10 text-center text-foreground/50 bg-secondary-background">
      Aucun partenaire — ajoutez le premier !
    </div>
  )

  return (
    <>
      {/* ── Mobile : cartes ── */}
      <div className="md:hidden space-y-3">
        {partners.length === 0 && empty}
        {partners.map((partner) => (
          <div key={partner.id} className="border-2 border-border rounded-base bg-secondary-background shadow-shadow p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                {partner.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={partner.logoUrl} alt="" className="h-8 w-8 object-contain shrink-0" />
                )}
                <p className="font-heading text-sm leading-tight truncate">{partner.name}</p>
              </div>
              {partner.published
                ? <Badge variant="neutral" className="shrink-0">Publié</Badge>
                : <Badge variant="neutral" className="shrink-0">Masqué</Badge>}
            </div>
            {partner.description && (
              <p className="text-xs text-foreground/60 line-clamp-2">{partner.description}</p>
            )}
            <div className="flex items-center gap-2 pt-1 border-t-2 border-border">
              <Button
                size="sm" variant="neutral" className="flex-1 gap-1.5"
                onClick={() => handleTogglePublish(partner)}
                disabled={loading === partner.id}
              >
                {partner.published
                  ? <><EyeOff className="size-3.5" /> Masquer</>
                  : <><Eye className="size-3.5" /> Publier</>}
              </Button>
              <Button size="icon" variant="neutral" asChild>
                <Link href={`/dashboard/partners/${partner.id}/edit`}><Pencil className="size-4" /></Link>
              </Button>
              <Button size="icon" variant="neutral" onClick={() => setDeleteId(partner.id)}>
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
              <TableHead>Logo</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Site web</TableHead>
              <TableHead>Ordre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-foreground/50 py-12">
                  Aucun partenaire — ajoutez le premier !
                </TableCell>
              </TableRow>
            )}
            {partners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  {partner.logoUrl
                    ? <img src={partner.logoUrl} alt="" className="h-8 w-12 object-contain" />
                    : <span className="text-foreground/30 text-xs">—</span>}
                </TableCell>
                <TableCell className="font-heading">{partner.name}</TableCell>
                <TableCell>
                  {partner.websiteUrl
                    ? <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-main hover:underline text-xs">
                        <ExternalLink className="size-3" /> {new URL(partner.websiteUrl).hostname}
                      </a>
                    : <span className="text-foreground/30 text-xs">—</span>}
                </TableCell>
                <TableCell className="text-foreground/60 text-sm">{partner.order}</TableCell>
                <TableCell>
                  {partner.published
                    ? <Badge variant="neutral">Publié</Badge>
                    : <Badge variant="neutral">Masqué</Badge>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon" variant="neutral"
                      onClick={() => handleTogglePublish(partner)}
                      disabled={loading === partner.id}
                      title={partner.published ? "Masquer" : "Publier"}
                    >
                      {partner.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button size="icon" variant="neutral" asChild>
                      <Link href={`/dashboard/partners/${partner.id}/edit`}><Pencil className="size-4" /></Link>
                    </Button>
                    <Button size="icon" variant="neutral" onClick={() => setDeleteId(partner.id)}>
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
            <DialogTitle>Supprimer le partenaire</DialogTitle>
            <DialogDescription>Cette action est irréversible.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="neutral" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

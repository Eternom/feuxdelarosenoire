"use client"

import { useEffect, useState } from "react"
import { ImageIcon, Loader2, Trash2, RefreshCw } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface MediaImage {
  key: string
  url: string
  size: number
  lastModified: string | null
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}

export default function MediaPage() {
  const [images, setImages]       = useState<MediaImage[]>([])
  const [loading, setLoading]     = useState(true)
  const [cleaning, setCleaning]   = useState(false)

  const fetchImages = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<MediaImage[]>("/api/admin/upload")
      setImages(data)
    } catch {
      toast.error("Impossible de charger les images")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchImages() }, [])

  const handleCleanup = async () => {
    setCleaning(true)
    try {
      const { data } = await axios.post<{ deleted: number }>("/api/admin/upload/cleanup")
      if (data.deleted === 0) {
        toast.success("Aucun orphelin — tout est propre")
      } else {
        toast.success(`${data.deleted} image${data.deleted > 1 ? "s" : ""} orpheline${data.deleted > 1 ? "s" : ""} supprimée${data.deleted > 1 ? "s" : ""}`)
        await fetchImages()
      }
    } catch {
      toast.error("Erreur lors du nettoyage")
    } finally {
      setCleaning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Médias</h1>
          <p className="text-foreground/60 mt-1">{images.length} image{images.length > 1 ? "s" : ""} stockée{images.length > 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="neutral" onClick={fetchImages} disabled={loading} className="gap-2">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button onClick={handleCleanup} disabled={cleaning || loading} className="gap-2">
            {cleaning ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
            Nettoyer les orphelins
          </Button>
        </div>
      </div>

      <div className="border-2 border-border rounded-base bg-secondary-background shadow-shadow overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b-2 border-border bg-background">
          <ImageIcon className="size-4 text-main shrink-0" />
          <span className="font-heading text-sm uppercase tracking-wider">Bibliothèque</span>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="size-6 animate-spin text-foreground/40" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2 text-foreground/40">
              <ImageIcon className="size-8" />
              <p className="text-sm font-heading">Aucune image — uploadez-en depuis les formulaires</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img) => (
                <div key={img.key} className="border-2 border-border rounded-base overflow-hidden bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full aspect-square object-cover" />
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-foreground/60 truncate">{img.key}</p>
                    <p className="text-xs text-foreground/40">{formatBytes(img.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-foreground/40">
        Les images orphelines sont les fichiers uploadés mais non associés à un événement ou partenaire. Le bouton &quot;Nettoyer&quot; les supprime définitivement.
      </p>
    </div>
  )
}

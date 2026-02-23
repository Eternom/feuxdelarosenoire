"use client"

import { useEffect, useRef, useState } from "react"
import { ImageIcon, Upload, Check, Loader2, Trash2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface MediaImage {
  key: string
  url: string
  size: number
  lastModified: string | null
}

interface MediaPickerProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  hint?: string
}

export function MediaPicker({ value, onChange, label = "Image", hint }: MediaPickerProps) {
  const [open, setOpen]         = useState(false)
  const [images, setImages]     = useState<MediaImage[]>([])
  const [loading, setLoading]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selected, setSelected] = useState(value ?? "")
  const fileRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (open) fetchImages()
  }, [open])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const { data } = await axios.post<{ url: string }>("/api/admin/upload", form)
      setImages((prev) => [{ key: data.url.split("/").pop()!, url: data.url, size: file.size, lastModified: new Date().toISOString() }, ...prev])
      setSelected(data.url)
      toast.success("Image uploadée")
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : null
      toast.error(msg ?? "Erreur lors de l'upload")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const confirm = () => {
    onChange(selected)
    setOpen(false)
  }

  return (
    <div className="space-y-1.5">
      {label && <p className="font-heading text-sm">{label}</p>}
      {hint  && <p className="text-xs text-foreground/50">{hint}</p>}

      {/* Prévisualisation + bouton */}
      <div
        className="border-2 border-border rounded-base bg-background flex items-center gap-3 p-3 cursor-pointer hover:border-foreground/40 transition-colors"
        onClick={() => setOpen(true)}
      >
        {value ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={value} alt="" className="h-12 w-16 object-cover rounded shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
        ) : (
          <div className="h-12 w-16 border-2 border-dashed border-border rounded flex items-center justify-center shrink-0">
            <ImageIcon className="size-5 text-foreground/30" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {value
            ? <p className="text-xs text-foreground/60 truncate">{value.split("/").pop()}</p>
            : <p className="text-xs text-foreground/40">Aucune image sélectionnée</p>}
          <p className="text-xs text-main font-heading mt-0.5">Cliquer pour choisir</p>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-5 py-4 border-b-2 border-border shrink-0">
            <DialogTitle className="font-heading">Bibliothèque d&apos;images</DialogTitle>
          </DialogHeader>

          {/* Toolbar */}
          <div className="px-5 py-3 border-b-2 border-border flex items-center gap-3 shrink-0 bg-background">
            <Button
              size="sm"
              variant="neutral"
              className="gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Uploader une image
            </Button>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
            <span className="text-xs text-foreground/40">JPG, PNG, WebP, SVG — max 5 Mo</span>
          </div>

          {/* Grille */}
          <div className="overflow-y-auto flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="size-6 animate-spin text-foreground/40" />
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-foreground/40">
                <ImageIcon className="size-8" />
                <p className="text-sm font-heading">Aucune image — uploadez-en une</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {images.map((img) => (
                  <button
                    key={img.key}
                    type="button"
                    onClick={() => setSelected(img.url)}
                    className={`relative aspect-square border-2 rounded-base overflow-hidden transition-all ${
                      selected === img.url
                        ? "border-main shadow-shadow"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {selected === img.url && (
                      <div className="absolute inset-0 bg-main/30 flex items-center justify-center">
                        <Check className="size-6 text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t-2 border-border flex items-center justify-between gap-3 shrink-0 bg-background">
            <Button variant="neutral" size="sm" onClick={() => { setSelected(""); onChange(""); setOpen(false) }}>
              <Trash2 className="size-3.5" />
              Retirer l&apos;image
            </Button>
            <div className="flex gap-2">
              <Button variant="neutral" size="sm" onClick={() => setOpen(false)}>Annuler</Button>
              <Button size="sm" onClick={confirm} disabled={!selected}>Choisir</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

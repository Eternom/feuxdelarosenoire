"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { Globe, FileText, ArrowUpDown, Eye, EyeOff, Image as ImageIcon } from "lucide-react"
import { MediaPicker } from "@/components/dashboard/media-picker"
import { createPartnerSchema, type CreatePartnerInput } from "@/lib/validations/partner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PartnerFormProps {
  defaultValues?: Partial<CreatePartnerInput> & { id?: string }
  mode: "create" | "edit"
}

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-2 border-border rounded-base bg-secondary-background shadow-shadow overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b-2 border-border bg-background">
        <Icon className="size-4 text-main shrink-0" />
        <span className="font-heading text-sm uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

export function PartnerForm({ defaultValues, mode }: PartnerFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePartnerInput>({
    resolver: zodResolver(createPartnerSchema),
    defaultValues: {
      published: true,
      order: 0,
      ...defaultValues,
    },
  })

  const logoUrl   = watch("logoUrl")
  const published = watch("published")

  const onSubmit = async (data: CreatePartnerInput) => {
    try {
      if (mode === "create") {
        await axios.post("/api/admin/partners", data)
        toast.success("Partenaire ajouté")
      } else {
        await axios.put(`/api/admin/partners/${defaultValues?.id}`, data)
        toast.success("Modifications enregistrées")
      }
      router.push("/dashboard/partners")
      router.refresh()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">

      {/* ── Informations ── */}
      <Section icon={FileText} title="Informations">
        <div className="space-y-1.5">
          <Label className="font-heading text-sm">
            Nom du partenaire <span className="text-main">*</span>
          </Label>
          <Input placeholder="Ex : Commune de Liège, ASBL Arts et Métiers…" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="font-heading text-sm">Description courte</Label>
          <p className="text-xs text-foreground/50">Rôle ou nature du partenariat (optionnel)</p>
          <Textarea
            rows={3}
            placeholder="Ex : Soutien financier, mise à disposition de locaux…"
            {...register("description")}
          />
        </div>
      </Section>

      {/* ── Liens & visuel ── */}
      <Section icon={Globe} title="Liens & visuel">
        <div className="space-y-1.5">
          <Label className="font-heading text-sm flex items-center gap-1.5">
            <Globe className="size-3.5 text-main" /> Site web
          </Label>
          <Input
            type="url"
            placeholder="https://www.partenaire.be"
            {...register("websiteUrl")}
          />
          {errors.websiteUrl && <p className="text-xs text-red-500">{errors.websiteUrl.message}</p>}
        </div>

        <MediaPicker
          value={logoUrl}
          onChange={(url) => setValue("logoUrl", url)}
          label="Logo"
          hint="PNG ou SVG avec fond transparent de préférence."
        />
        {errors.logoUrl && <p className="text-xs text-red-500">{errors.logoUrl.message}</p>}
      </Section>

      {/* ── Affichage ── */}
      <Section icon={ArrowUpDown} title="Affichage">
        <div className="space-y-1.5">
          <Label className="font-heading text-sm">Ordre d&apos;affichage</Label>
          <p className="text-xs text-foreground/50">Les partenaires sont triés du plus petit au plus grand numéro</p>
          <Input
            type="number"
            min={0}
            placeholder="0"
            {...register("order", { valueAsNumber: true })}
          />
        </div>
      </Section>

      {/* ── Publication ── */}
      <Section icon={published ? Eye : EyeOff} title="Publication">
        <button
          type="button"
          onClick={() => setValue("published", !published)}
          className={`w-full flex items-center justify-between p-4 rounded-base border-2 transition-colors text-left ${
            published ? "border-border bg-secondary-background" : "border-border bg-background"
          }`}
        >
          <div>
            <p className="font-heading text-sm">
              {published ? "Publié — visible sur le site" : "Masqué — non visible"}
            </p>
            <p className="text-xs text-foreground/50 mt-0.5">
              {published
                ? "Ce partenaire apparaît dans la section partenaires."
                : "Ce partenaire n'est pas affiché sur le site. Cliquez pour publier."}
            </p>
          </div>
          <div className={`relative w-11 h-6 rounded-full border-2 border-border transition-colors shrink-0 ml-4 ${published ? "bg-main" : "bg-foreground/20"}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-border transition-transform ${published ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
        </button>
        <input type="checkbox" className="sr-only" {...register("published")} />
      </Section>

      {/* ── Boutons ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
          {isSubmitting
            ? (mode === "create" ? "Ajout en cours…" : "Enregistrement…")
            : (mode === "create" ? "Ajouter le partenaire" : "Enregistrer les modifications")}
        </Button>
        <Button type="button" variant="neutral" onClick={() => router.push("/dashboard/partners")}>
          Annuler
        </Button>
      </div>

    </form>
  )
}

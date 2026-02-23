"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import axios from "axios"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, MapPin, FileText, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import { MediaPicker } from "@/components/dashboard/media-picker"
import { createEventSchema, type CreateEventInput } from "@/lib/validations/event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EventFormProps {
  defaultValues?: Partial<CreateEventInput> & { id?: string }
  mode: "create" | "edit"
}

const eventTypes = [
  { value: "STAGE",      label: "Stage",      desc: "Atelier pratique ou formation" },
  { value: "MARCHE",     label: "Marché",      desc: "Marché artisanal ou foire" },
  { value: "EXPOSITION", label: "Exposition",  desc: "Exposition d'œuvres" },
  { value: "AUTRE",      label: "Autre",       desc: "Autre type d'événement" },
]

const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 15, 30, 45]

function parseDateStr(str?: string): Date | undefined {
  if (!str) return undefined
  const d = new Date(str)
  return isNaN(d.getTime()) ? undefined : d
}

function buildISOString(date: Date, h: number, m: number): string {
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return format(d, "yyyy-MM-dd'T'HH:mm")
}

/* ─── DatePicker ─── */
interface DatePickerProps {
  label: string
  hint?: string
  value?: string
  onChange: (val: string) => void
  required?: boolean
  error?: string
}

function DatePickerField({ label, hint, value, onChange, required, error }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const date    = parseDateStr(value)
  const hours   = date ? date.getHours()   : 9
  const minutes = date ? date.getMinutes() : 0

  const handleDaySelect = (day?: Date) => {
    if (!day) return
    onChange(buildISOString(day, hours, minutes))
    setOpen(false)
  }

  const handleHour = (h: string) => {
    if (!date) return
    onChange(buildISOString(date, Number(h), minutes))
  }

  const handleMinute = (m: string) => {
    if (!date) return
    onChange(buildISOString(date, hours, Number(m)))
  }

  return (
    <div className="space-y-1.5">
      <Label className="font-heading text-sm">
        {label}{required && <span className="text-main ml-1">*</span>}
      </Label>
      {hint && <p className="text-xs text-foreground/50">{hint}</p>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="neutral"
            className="w-full justify-start text-left font-base h-10"
          >
            <CalendarIcon className="mr-2 size-4 shrink-0 text-main" />
            {date ? (
              <span>
                {format(date, "d MMMM yyyy", { locale: fr })}
                {" — "}
                <span className="text-main font-heading">
                  {String(hours).padStart(2, "0")}h{String(minutes).padStart(2, "0")}
                </span>
              </span>
            ) : (
              <span className="text-foreground/40">Choisir une date…</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            locale={fr}
          />
          <div className="border-t-2 border-border p-3 space-y-2">
            <p className="text-xs font-heading text-foreground/60 uppercase tracking-widest">Heure de l&apos;événement</p>
            <div className="flex items-center gap-2">
              <select
                value={hours}
                onChange={e => handleHour(e.target.value)}
                disabled={!date}
                className="flex-1 h-9 rounded-base border-2 border-border bg-background px-2 text-sm font-heading text-foreground disabled:opacity-40 cursor-pointer"
              >
                {HOURS.map(h => (
                  <option key={h} value={h}>{String(h).padStart(2, "0")} h</option>
                ))}
              </select>
              <span className="font-heading text-lg">:</span>
              <select
                value={minutes}
                onChange={e => handleMinute(e.target.value)}
                disabled={!date}
                className="flex-1 h-9 rounded-base border-2 border-border bg-background px-2 text-sm font-heading text-foreground disabled:opacity-40 cursor-pointer"
              >
                {MINUTES.map(m => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
            </div>
            {!date && (
              <p className="text-xs text-foreground/40">Sélectionnez d&apos;abord une date</p>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ─── Section card ─── */
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

/* ─── Main form ─── */
export function EventForm({ defaultValues, mode }: EventFormProps) {
  const router = useRouter()
  const imageUrl = watch("imageUrl")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      published: false,
      ...defaultValues,
    },
  })

  const startDate = watch("startDate")
  const endDate   = watch("endDate")
  const published = watch("published")


  const onSubmit = async (data: CreateEventInput) => {
    try {
      if (mode === "create") {
        await axios.post("/api/admin/events", data)
        toast.success("Événement créé avec succès")
      } else {
        await axios.put(`/api/admin/events/${defaultValues?.id}`, data)
        toast.success("Modifications enregistrées")
      }
      router.push("/dashboard/events")
      router.refresh()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">

      {/* ── Informations principales ── */}
      <Section icon={FileText} title="Informations principales">
        <div className="space-y-1.5">
          <Label className="font-heading text-sm">
            Titre <span className="text-main">*</span>
          </Label>
          <Input placeholder="Ex : Stage de forge — initiation" {...register("title")} />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="font-heading text-sm">
            Description <span className="text-main">*</span>
          </Label>
          <p className="text-xs text-foreground/50">Programme, public visé, matériel fourni, informations pratiques…</p>
          <Textarea
            rows={5}
            placeholder="Décrivez l'événement en détail…"
            {...register("description")}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="font-heading text-sm">
            Type <span className="text-main">*</span>
          </Label>
          <Select
            defaultValue={defaultValues?.type}
            onValueChange={(val) => setValue("type", val as CreateEventInput["type"])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir le type d'événement" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="font-heading">{t.label}</span>
                  <span className="text-foreground/50 ml-2 text-xs hidden sm:inline">{t.desc}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
        </div>
      </Section>

      {/* ── Dates & lieu ── */}
      <Section icon={CalendarIcon} title="Dates & lieu">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePickerField
            label="Date de début"
            hint="Jour et heure de démarrage"
            required
            value={startDate}
            onChange={(val) => setValue("startDate", val, { shouldValidate: true })}
            error={errors.startDate?.message}
          />
          <DatePickerField
            label="Date de fin"
            hint="Facultatif — si l'événement s'étend sur plusieurs jours"
            value={endDate}
            onChange={(val) => setValue("endDate", val)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="font-heading text-sm flex items-center gap-1.5">
            <MapPin className="size-3.5 text-main" /> Lieu
          </Label>
          <p className="text-xs text-foreground/50">Adresse complète ou nom du lieu</p>
          <Input
            placeholder="Ex : Atelier Feux de la Rose Noire, Rue de la Forge 12, Liège"
            {...register("location")}
          />
        </div>
      </Section>

      {/* ── Image ── */}
      <Section icon={ImageIcon} title="Image de l'événement">
        <MediaPicker
          value={imageUrl}
          onChange={(url) => setValue("imageUrl", url)}
          hint="Choisissez une image depuis la bibliothèque ou uploadez-en une nouvelle."
        />
        {errors.imageUrl && <p className="text-xs text-red-500">{errors.imageUrl.message}</p>}
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
              {published ? "Publié — visible sur le site" : "Brouillon — non visible"}
            </p>
            <p className="text-xs text-foreground/50 mt-0.5">
              {published
                ? "Cet événement apparaît dans le calendrier et la liste publique."
                : "Cet événement n'est pas encore visible par les visiteurs. Cliquez pour publier."}
            </p>
          </div>
          <div
            className={`relative w-11 h-6 rounded-full border-2 border-border transition-colors shrink-0 ml-4 ${
              published ? "bg-main" : "bg-foreground/20"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white border border-border transition-transform ${
                published ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>
        <input type="checkbox" className="sr-only" {...register("published")} />
      </Section>

      {/* ── Boutons ── */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none">
          {isSubmitting
            ? (mode === "create" ? "Création en cours…" : "Enregistrement…")
            : (mode === "create" ? "Créer l'événement" : "Enregistrer les modifications")}
        </Button>
        <Button
          type="button"
          variant="neutral"
          onClick={() => router.push("/dashboard/events")}
        >
          Annuler
        </Button>
      </div>

    </form>
  )
}

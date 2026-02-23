import { z } from "zod"

export const eventTypeEnum = z.enum(["STAGE", "MARCHE", "EXPOSITION", "AUTRE"])

export const createEventSchema = z.object({
  title: z.string().min(3, "Titre requis (min 3 caractères)"),
  description: z.string().min(10, "Description requise (min 10 caractères)"),
  type: eventTypeEnum,
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.boolean(),
})

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string(),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>

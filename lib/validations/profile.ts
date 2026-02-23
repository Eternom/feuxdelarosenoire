import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  address: z.string().min(5, "Adresse requise"),
  country: z.string().min(2, "Pays requis"),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

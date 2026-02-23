import { z } from "zod"

const urlOrEmpty = z.string().url().optional().or(z.literal("")).transform(v => v === "" ? undefined : v)

export const createPartnerSchema = z.object({
  name:        z.string().min(1, "Nom requis"),
  logoUrl:     urlOrEmpty,
  websiteUrl:  urlOrEmpty,
  description: z.string().optional(),
  order:       z.number().int().default(0),
  published:   z.boolean(),
})

export const updatePartnerSchema = createPartnerSchema.partial().extend({
  id: z.string(),
})

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>

import { z } from 'zod'

export const categorySchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    slug: z.string().nonempty()
  })
})

export const categoryParams = z.object({
  params: z.object({
    id: z.string().nonempty()
  })
})

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().nonempty().optional(),
    slug: z.string().nonempty().optional()
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined))
})
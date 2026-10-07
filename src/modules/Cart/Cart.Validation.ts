import { z } from "zod"

export const itemBodySchema = z.object({
  body: z.object({
    productId: z.string().nonempty(),
    quantity: z.coerce.number().int().min(0)
  })
})

export const mergeBodySchema = z.object({
  body: z.object({
    sessionToken: z.string().nonempty()
  })
})

export const itemParams = z.object({
  params: z.object({
    id: z.string().nonempty()
  })
})

export const updateQuantityBody = z.object({
  body: z.object({
    quantity: z.coerce.number().int().min(0)
  })
})
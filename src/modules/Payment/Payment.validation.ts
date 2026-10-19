import { z } from "zod"

export const paymentSchema = z.object({
  body: z.object({
    orderId: z.string().nonempty()
  })
})
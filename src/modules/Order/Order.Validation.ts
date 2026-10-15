import { z } from "zod"

export const createOrderSchema = z.object({
  headers: z.object({
    "idempotency-key": z.string().min(1),
  }),

  body: z.object({
    addressId: z.string().nonempty(),
    paymentProvider: z.string().nonempty()
  }),
});

export const orderById = z.object({
  params: z.object({
    id: z.string().nonempty()
  })
})
import { z } from "zod";

export const addressBodySchema = z.object({
  body: z.object({
    city: z.string().nonempty(),
    state: z.string().nonempty(),
    country: z.string().nonempty(),
    isDefault: z.boolean(),
    streetAddress: z.string()
  }),
})

export const addressIdSchema = z.object({
  params: z.object({
    id: z.string().nonempty(),
  }),
});

export const updateAddressSchema = z.object({
  params: z.object({
    id: z.string().nonempty(),
  }),
  body: z.object({
    city: z.string().nonempty(),
    state: z.string().nonempty(),
    country: z.string().nonempty(),
    isDefault: z.boolean(),
    streetAddress: z.string(),
  }),
});
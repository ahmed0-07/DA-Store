import { z } from 'zod'

export const productSchema = z.object({
  body: z.object({
    sku: z.string().nonempty(),
    name: z.string().nonempty(),
    slug: z.string().nonempty(),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    stockQuantity: z.coerce.number().int().min(0).optional(),
    categoryId: z.string().nonempty().optional(),
    isActive: z.boolean().optional()
  })
})

export const productIdParams = z.object({
  params: z.object({
    id: z.string().nonempty()
  })
})

export const productSlugParams = z.object({
  params: z.object({
    slug: z.string().nonempty()
  })
})

export const productImageSchema = z.object({
  body: z.object({
    url: z.string().nonempty(),
    altText: z.string().optional(),
    displayOrder: z.coerce.number().int().min(0).optional(),
    isPrimary: z.boolean().optional()
  })
})

export const productImageIdParams = z.object({
  params: z.object({
    id: z.string().nonempty(),
    imageId: z.string().nonempty()
  })
})

export const updateProductSchema = z.object({
  body: z.object({
    sku: z.string().nonempty().optional(),
    name: z.string().nonempty().optional(),
    slug: z.string().nonempty().optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    stockQuantity: z.coerce.number().int().min(0).optional(),
    categoryId: z.string().nonempty().optional(),
    isActive: z.boolean().optional()
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined))
})

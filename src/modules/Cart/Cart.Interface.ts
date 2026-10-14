import type { Prisma } from "@prisma/client";
import { z } from "zod"
import type { itemBodySchema } from "./Cart.Validation.js";

type ICart = Prisma.CartGetPayload<{
  include: {
    cartItems: {
      include: {
        product: true
      }
    }
  }
}>;

export interface ICartResult {
  cart: ICart,
  sessionToken: string | null
}

export type AddItemBody = z.infer<typeof itemBodySchema.shape.body>

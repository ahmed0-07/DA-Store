import { ca } from "zod/v4/locales";
import prisma from "../../lib/db.js";
import APIError from "../../shared/utils/APIError.js";
import type { AddItemBody, ICartResult } from "./Cart.Interface.js";
import app from "../../app.js";

const resolveCart = async (userId: string | undefined, sessionToken: string | undefined): Promise<ICartResult> => {
  if (userId) {
      let cart = await prisma.cart.findFirst({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true } },
                },
              },
            },
          },
        },
      })

      if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
            include: {
              cartItems: {
                include: {
                  product: {
                    include: { images: { where: { isPrimary: true } } },
                  },
                },
              },
            },
          })
      }
  
      return { cart, sessionToken: null };
    }

    if (sessionToken) {
      const cart = await prisma.cart.findUnique({
        where: { sessionToken },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true } },
                },
              },
            },
          },
        },
      });
    
      if (cart) {
        return { cart, sessionToken: null };
      }
    }

    const newToken = crypto.randomUUID();
    const cart = await prisma.cart.create({
      data: { sessionToken: newToken },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true } },
              },
            },
          },
        },
      },
    });
    
    return { cart, sessionToken: newToken };
}

class cartService {
  findCart = async (userId: string | undefined, session: string | undefined): Promise<ICartResult> => {
    return await resolveCart(userId, session)
  }

  addItem = async (userId: string | undefined, session: string | undefined, body: AddItemBody): Promise<ICartResult> => {
      const product = await prisma.product.findUnique({
        where: { id: body.productId },
        select: { id: true, stockQuantity: true, isActive: true },
      });
    
      if (!product || !product.isActive) {
        throw new APIError('Product Not Found', 404);
      }
    
      const { cart, sessionToken } = await resolveCart(userId, session);
    
      const existingCartItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: body.productId,
          },
        },
      });
    
      const currentQty = existingCartItem ? existingCartItem.quantity : 0;
      if (currentQty + body.quantity > product.stockQuantity) {
        throw new APIError('Insufficient Stock', 400);
      }
    
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: body.productId,
          },
        },
        update: {
          quantity: { increment: body.quantity },
        },
        create: {
          cartId: cart.id,
          productId: body.productId,
          quantity: body.quantity,
        },
      });
    
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                  },
                },
              },
            },
          },
        },
      });
    
      if (!updatedCart) {
        throw new APIError('Cart Not Found', 404);
      }
    
      return { cart: updatedCart, sessionToken };
  }

  removeItem = async (userId: string | undefined, session: string | undefined, id: string): Promise<ICartResult> => {
    const { cart, sessionToken } = await resolveCart(userId, session)

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: id
        }
      }
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                },
              },
            },
          },
        },
      },
    });

    if (!updatedCart) {
      throw new APIError('Cart Not Found', 404);
    }

    return { cart: updatedCart, sessionToken }
  }

  updateItemQuantity = async (userId: string | undefined, session: string | undefined, productId: string, quantity: number): Promise<ICartResult> => {
    const { cart, sessionToken } = await resolveCart(userId, session)
    
    if (quantity <= 0) {
        await prisma.cartItem.deleteMany({
          where: {
            cartId: cart.id,
            productId: productId,
          },
        });
      } else {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { stockQuantity: true, isActive: true },
        });
    
        if (!product || !product.isActive) {
          throw new APIError('Product Not Found', 404);
        }
    
        if (quantity > product.stockQuantity) {
          throw new APIError('Insufficient Stock', 400);
        }
    
        await prisma.cartItem.update({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: productId,
            },
          },
          data: { quantity },
        });
      }
    
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true } },
                },
              },
            },
            orderBy: { id: 'asc' },
          },
        },
      });
    
      if (!updatedCart) {
        throw new APIError('Cart Not Found', 404);
      }
    
      return { cart: updatedCart, sessionToken };
  }

  mergeCarts = async (userId: string, session: string) => {
    const { cart, sessionToken } = await resolveCart(userId, session)

    await prisma.cart.update({
      where: {
        id: cart.id
      },
      data: {
        userId: userId
      }
    })
  }
}

export default new cartService()
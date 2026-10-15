import prisma from "../../lib/db.js";
import APIError from "../../shared/utils/APIError.js";
import { resolveCart } from "../Cart/Cart.Service.js";
import type { OrderItemInput } from "./Order.Interface.js";

class orderService {
  getOrdersForUser = async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId
      },
      include: {
        orderItems: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders
  }

  getOrder = async (userId: string, orderId: string) => {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId
      },
      include: {
        orderItems: true
      }
    })

    return order
  }

  // to-do
  cancelOrderByUser = async (userId: string, orderId: string) => {
    await prisma.order.update({
      where: {
        id: orderId,
        userId: userId,
      },
      data: {
        status: "cancelled"
      }
    })
  }

  // to-do
  cancelOrderByAdmin = async (orderId: string) => {
    await prisma.order.update({
      where: {
        id: orderId,
        status: "pending"
      },
      data: {
        status: "cancelled"
      }
    })
  }

  addOrder = async (userId: string, idemKey: string, paymentProvider?: string) => {
    let order = await prisma.order.findUnique({
      where: {
        idempotencyKey: idemKey
      }
    })

    if (order) {
      return order
    }

    const result = await resolveCart(userId)
    const cart = result.cart

    let totalAmount = 0
    const orderItems: OrderItemInput[] = []
    
    await prisma.$transaction(async (tx) => {
      for (const item of cart.cartItems) {
        const product = await tx.product.findUnique({
          where: {
            id: item.productId
          }
        })
        
        if (!product || !product.isActive) {
          throw new APIError(`PRODUCT_NOT_FOUND_OR_INACTIVE:${item.productId}`, 409);
        }
        
        const result = await tx.product.updateMany({
          where: {
            id: product.id,
            stockQuantity: {
              gte: item.quantity
            }
          },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        })

        if (result.count === 0) {
          throw new APIError(`Insufficient stock for ${item.product.name}`, 409);
        }

        const itemTotal = Number(product.price) * item.quantity
        totalAmount += itemTotal

        orderItems.push({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
        })
      }

      const address = await tx.address.findFirst({
        where: {
          userId: userId,
          isDefault: true
        }
      })

      if (!address) {
        throw new APIError('DEFAULT ADDRESS NOT FOUND', 404);
      }

      order = await tx.order.create({
        data: {
          userId: userId,
          paymentProvider: paymentProvider,
          idempotencyKey: idemKey,
          totalAmount: totalAmount,
          shippingAddress: {
            country: address.country,
            state: address.state,
            city: address.city,
            street: address.streetAddress
          },
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: true
        }
      })
    })

    return order
  }
}

export default new orderService()
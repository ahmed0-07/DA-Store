import type { NextFunction, Request, Response } from "express";
import stripeClient from "../../shared/config/stripe.js";
import prisma from "../../lib/db.js";
import APIError from "../../shared/utils/APIError.js";
import env from '../../shared/config/dotenv.js'

export const checkOut = async (req: Request, res: Response) => {
  const orderId = req.body.orderId
  const order = await prisma.order.findUnique({
    where: {
      id: orderId
    },
    include: {
      orderItems: true
    }
  })

  if (!order) {
    throw new APIError('order not exist', 404)
  }
  
  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    line_items: order.orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productName,
        },
        unit_amount: item.unitPrice
          .mul(100)
          .toDecimalPlaces(0)
          .toNumber(),
      },
      quantity: item.quantity,
    })),
    success_url: `${env.SERVER_URL}/api/v1/`,
    cancel_url: `${env.SERVER_URL}/api/v1/`,
  })

  res.status(302).json({
    message: "Success",
    data: session.url
  })
}

export const handleStripeWebhook = (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string
    const bodyString = JSON.stringify(req.body, null, 2)
    const event = stripeClient.webhooks.constructEvent(bodyString, sig, env.STRIPE_WEBHOOK_SECRET_KEY)

    if (event.type === "checkout.session.completed") {
      
    } else if (event.type === "payment_intent.payment_failed") {
      
    }
  } catch (err) {
    next(err)
  }
}
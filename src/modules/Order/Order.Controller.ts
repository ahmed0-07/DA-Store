import type { Request, Response } from "express";
import OrderService from "./Order.Service.js";
import { UserRole } from "@prisma/client";

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.User?.id as string
  const data = await OrderService.getOrdersForUser(userId)
  
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const addOrder = async (req: Request, res: Response) => {
  const userId = req.User?.id as string
  const idemKey = req.headers["idempotency-key"] as string
  const data = await OrderService.addOrder(userId, idemKey, req.body.paymentProvider)
  res.status(201).json({
    status: "Success",
    data: data
  })
}

export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.User?.id as string
  const orderId = req.params.id as string
  const data = await OrderService.getOrder(userId, orderId)
  
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const cancelOrder = async (req: Request, res: Response) => {
  const userId = req.User?.id as string
  const orderId = req.params.id as string
  const role = req.User?.role

  if (role === UserRole.admin) {
    await OrderService.cancelOrderByAdmin(orderId)
  } else {
    await OrderService.cancelOrderByUser(userId, orderId)
  }
  
  res.status(200).json({
    status: "Success",
  })
}

// export const updateOrderStatus = async (req: Request, res: Response) => {
//   // TODO(service): add OrderService call here
//   const data = null
//   res.status(200).json({
//     status: "Success",
//     data: data
//   })
// }
// 
// export const getAllOrders = async (req: Request, res: Response) => {
//   // TODO(service): add OrderService call here filtring and pagination stuff
//   const data = null
//   res.status(200).json({
//     status: "Success",
//     data: data
//   })
// }

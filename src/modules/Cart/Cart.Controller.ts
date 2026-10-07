import { type Request, type Response } from "express"
import CartService from './Cart.Service.js'

const getCartIdentity = (req: Request) => {
  const userId = req.User?.id

  const headerToken = req.headers["x-session-token"]
  const sessionToken = (Array.isArray(headerToken) ? headerToken[0] : headerToken) ||undefined

  return { userId, sessionToken }
}

export const getCart = async (req: Request, res: Response) => {
  const { userId, sessionToken } = getCartIdentity(req)
  const data = await CartService.findCart(userId, sessionToken)

  if (data.sessionToken) {
    res.setHeader('X-Session-Token', data.sessionToken);
  }
  
  res.status(200).json({
    status: "Success",
    data: data.cart,
  })
}

export const addItemToCart = async (req: Request, res: Response) => {
  const { userId, sessionToken } = getCartIdentity(req)
  const { productId, quantity } = req.body

  const data = await CartService.addItem(userId, sessionToken, { productId, quantity })

  if (data.sessionToken) {
    res.setHeader('X-Session-Token', data.sessionToken);
  }

  res.status(200).json({
    status: "Success",
    data: data.cart
  })
}

export const updateCartItem = async (req: Request, res: Response) => {
  const { userId, sessionToken } = getCartIdentity(req)
  const productId = req.params.id as string
  const { quantity } = req.body

  const data = await CartService.updateItemQuantity(userId, sessionToken, productId, quantity)

  res.status(200).json({
    status: "Success",
    data: data.cart
  })
}

export const removeCartItem = async (req: Request, res: Response) => {
  const { userId, sessionToken } = getCartIdentity(req)
  const itemId = req.params.id as string

  const data = await CartService.removeItem(userId, sessionToken, itemId)
  
  res.status(200).json({
    status: "Success",
    data: data.cart
  })
}

export const mergeCarts = async (req: Request, res: Response) => {
  const userId = req.User?.id as string
  const { sessionToken } = getCartIdentity(req)

  await CartService.mergeCarts(userId, sessionToken as string)

  res.status(200).json({
    status: "Success",
  })
}
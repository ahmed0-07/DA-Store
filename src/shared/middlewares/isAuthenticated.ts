import { type Request, type Response, type NextFunction } from "express"
import { verifyToken } from "../../lib/jwt.js"
import prisma from "../../lib/db.js";
import type { IUser } from "../../modules/User/User.Interface.js";
import APIError from "../utils/APIError.js";

export const isAuthenticated = (strict = true) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (!strict) {
        return next()
      }
      
      throw new APIError('Access token required', 401)
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token!)

    if (!decoded) {
      throw new APIError('Invalid or expired token', 401)
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      }
    })

    if (!user) {
      throw new APIError('Unauthorized', 401)
    }

    req.User = user as IUser
    next()
  }
}
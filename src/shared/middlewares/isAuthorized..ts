import { type NextFunction, type Request, type Response } from "express"
import { UserRole } from "@prisma/client"
import APIError from "../utils/APIError.js"

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  if (req.User?.role !== UserRole.admin) {
    throw new APIError("Forbidden", 403)
  }

  next()
}
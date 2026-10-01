import { type Request, type Response, type NextFunction } from "express";
import { createToken } from "../../lib/jwt.js";
import APIError from "../../shared/utils/APIError.js";

export const googleCallback = (req: Request, res: Response) => {
  if (!req.user) {
    throw new APIError('Unauthorized', 401)
  }

  const token = createToken(req.user.id);
  res.status(200).json({
    message: "Success",
    token: token
  })
}
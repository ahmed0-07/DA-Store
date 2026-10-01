import { type Request, type Response, type NextFunction } from "express";
import { createToken } from "../../lib/jwt.js";

export const googleCallback = (req: Request, res: Response) => {
  if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = createToken(req.user.id);
  res.status(200).json({
    status: "Sucess",
    token: token
  })
}
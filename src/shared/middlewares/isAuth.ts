import { type Request, type Response, type NextFunction } from "express"
import { verifyToken } from "../../lib/jwt.js"
import prisma from "../../lib/db.js";
import type { IUser } from "../../modules/User/User.Interface.js";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
  }
  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token!)

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id
    }
  })

  if (!user) {
    //error - todo
    return
  }

  req.User = user as IUser
  next()
}
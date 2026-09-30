import jwt from 'jsonwebtoken'
import { type IToken } from '../shared/interfaces/types.js'
import env from '../shared/config/dotenv.js'

export const createToken = (id: string) => {
  const token = jwt.sign({ id }, env.JWT_SECRET!)
  return token
}

export const verifyToken = (token: string): IToken => {
  const decoded = jwt.verify(token, env.JWT_SECRET!) as IToken
  return decoded
}
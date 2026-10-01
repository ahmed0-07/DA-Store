import { z } from 'zod'
import { type NextFunction, type Request, type Response } from 'express'
import APIError from '../utils/APIError.js'

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params
    })

    if (!result.success) {
      throw new APIError("Invalid input data. Please check your request.", 400)
    }

    next()
  }
}
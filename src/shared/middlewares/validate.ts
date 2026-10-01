import { z } from 'zod'
import { type NextFunction, type Request, type Response } from 'express'

export const validate = (schema: z.ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params
    })

    if (!result.success) {
      // handle error - todo
      return res.status(500).json({
        message: "Failed",
        error: result.error
      })
    }

    next()
  }
}
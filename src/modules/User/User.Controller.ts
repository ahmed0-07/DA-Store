import { type Request, type Response } from 'express'
import userService from './User.Service.js'

export const getAddresses = async (req: Request, res: Response) => {
  const id = req.User?.id as string
  const data = await userService.findUserAddresses(id)

  res.status(200).json({
    status: "Sucess",
    data: data
  })
}

export const addAddress = async (req: Request, res: Response) => {
  const data = await userService.addAddress(req.User?.id as string, req.body)
  res.status(201).json({
    message: "Success",
    data: data
  })
}

export const updateAddress = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const data = await userService.updateAddress(id, req.body)

  res.status(200).json({
    message: "Success",
    data: data
  })
}

export const deleteAddress = async (req: Request, res: Response) => {
  const id = req.params.id as string
  const data = await userService.deleteAddress(id)

  res.status(200).json({
    message: "Success",
    data: data
  })
}
import type { Request, Response } from "express";
import ProductService from "./Product.Service.js";

export const getProducts = async (req: Request, res: Response) => {
  const data = await ProductService.findProducts()
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const getProductBySlug = async (req: Request, res: Response) => {
  const data = await ProductService.findProductBySlug(req.params.slug as string)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const addProduct = async (req: Request, res: Response) => {
  const data = await ProductService.addProduct(req.body)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const updateProduct = async (req: Request, res: Response) => {
  const data = await ProductService.updateProduct(req.params.id as string, req.body)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const deleteProduct = async (req: Request, res: Response) => {
  const data = await ProductService.deleteProduct(req.params.id as string)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const setProductImage = async (req: Request, res: Response) => {
  const data = await ProductService.setProductImage(req.params.id as string, req.body)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const removeProductImage = async (req: Request, res: Response) => {
  await ProductService.removeProductImage(req.params.id as string)
  res.status(204).send()
}

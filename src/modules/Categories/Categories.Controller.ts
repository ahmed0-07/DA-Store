import type { Request, Response } from "express";
import CategoriesService from "./Categories.Service.js";

export const getCategories = async (req: Request, res: Response) => {
  const data = await CategoriesService.findCategories()
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const addCategory = async (req: Request, res: Response) => {
  const data = await CategoriesService.addCategory(req.body)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const updateCategory = async (req: Request, res: Response) => {
  const data = await CategoriesService.updateCategory(req.params.id as string, req.body)
  res.status(200).json({
    status: "Success",
    data: data
  })
}

export const deleteCategory = async (req: Request, res: Response) => {
  const data = await CategoriesService.deleteCategory(req.params.id as string)
  res.status(200).json({
    status: "Success",
    data: data
  })
}
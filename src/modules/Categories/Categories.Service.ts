import prisma from "../../lib/db.js";
import type { ICategory } from "./Categories.Interface.js";

class categoryService {
  findCategories = async () => {
    const data = await prisma.category.findMany()
    return data
  }

  addCategory = async (body: ICategory) => {
    const data = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug
      }
    })

    return data
  }

  updateCategory = async (id: string, body: ICategory) => {
    const data = await prisma.category.update({
      where: {
        id: id
      },
      data: {
        name: body.name,
        slug: body.slug
      }
    })

    return data
  }

  deleteCategory = async (id: string) => {
    const data = await prisma.category.delete({
      where: {
        id: id
      }
    })

    return data
  }
}

export default new categoryService()
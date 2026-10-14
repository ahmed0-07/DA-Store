import prisma from "../../lib/db.js";
import APIError from "../../shared/utils/APIError.js";
import type { IProduct, IProductImageBody } from "./Product.Interface.js";

class productService {
  findProducts = async () => {
    const data = await prisma.product.findMany({
      where: {
        isActive: true
      }
    })
    return data
  }

  findProductBySlug = async (slug: string) => {
    const data = await prisma.product.findFirst({
      where: {
        slug: slug,
        isActive: true
      }
    })

    if (!data) {
      throw new APIError("Product not found", 404)
    }

    return data
  }

  addProduct = async (body: IProduct) => {
    const data = await prisma.product.create({
      data: {
        sku: body.sku,
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        stockQuantity: body.stockQuantity,
        categoryId: body.categoryId,
        imageUrl: body.imageUrl,
        isActive: body.isActive
      }
    })

    return data
  }

  updateProduct = async (id: string, body: Partial<IProduct>) => {
    const data = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        sku: body.sku,
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        stockQuantity: body.stockQuantity,
        categoryId: body.categoryId,
        imageUrl: body.imageUrl,
        isActive: body.isActive,
      }
    })

    return data
  }

  deleteProduct = async (id: string) => {
    const data = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        isActive: false
      }
    })

    return data
  }

  setProductImage = async (productId: string, body: IProductImageBody) => {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!product) {
      throw new APIError("Product not found", 404)
    }

    const data = await prisma.product.update({
      where: { id: productId },
      data: { imageUrl: body.imageUrl }
    })

    return data
  }

  removeProductImage = async (productId: string) => {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!product) {
      throw new APIError("Product not found", 404)
    }

    await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        imageUrl: null
      }
    })
  }
}

export default new productService()

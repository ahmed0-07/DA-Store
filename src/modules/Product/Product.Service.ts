import prisma from "../../lib/db.js";
import APIError from "../../shared/utils/APIError.js";
import type { IProduct, IProductImage } from "./Product.Interface.js";

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
      },
      include: {
        images: {
          orderBy: {
            displayOrder: 'asc'
          }
        }
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
        isActive: body.isActive
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

  addProductImage = async (productId: string, body: IProductImage) => {
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!product) {
      throw new APIError("Product not found", 404)
    }

    if (body.isPrimary === true) {
      const data = await prisma.$transaction(async (tx) => {
        await tx.productImage.updateMany({
          where: {
            productId: productId,
            isPrimary: true
          },
          data: {
            isPrimary: false
          }
        })

        return tx.productImage.create({
          data: {
            productId: productId,
            url: body.url,
            altText: body.altText,
            displayOrder: body.displayOrder,
            isPrimary: true
          }
        })
      })

      return data
    }

    const data = await prisma.productImage.create({
      data: {
        productId: productId,
        url: body.url,
        altText: body.altText,
        displayOrder: body.displayOrder,
        isPrimary: body.isPrimary
      }
    })

    return data
  }

  deleteProductImage = async (productId: string, imageId: string) => {
    const image = await prisma.productImage.findFirst({
      where: {
        id: imageId,
        productId: productId
      }
    })

    if (!image) {
      throw new APIError("Product image not found", 404)
    }

    await prisma.productImage.delete({
      where: {
        id: imageId
      }
    })
  }
}

export default new productService()

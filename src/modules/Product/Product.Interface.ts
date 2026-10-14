export interface IProduct {
  sku: string,
  name: string,
  slug: string,
  description?: string,
  price: number,
  stockQuantity?: number,
  categoryId?: string,
  imageUrl?: string,
  isActive?: boolean
}

export interface IProductImageBody {
  imageUrl: string
}

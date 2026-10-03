export interface IProduct {
  sku: string,
  name: string,
  slug: string,
  description?: string,
  price: number,
  stockQuantity?: number,
  categoryId?: string,
  isActive?: boolean
}

export interface IProductImage {
  url: string,
  altText?: string,
  displayOrder?: number,
  isPrimary?: boolean
}

export interface ProductInfo {
  name: string;
  price: number;
  totalQuantity: number;
  discount?: number;
  description?: string;
  address?: string;
}

export interface ProductReferences {
  sellerId?: number;
  productStatusId?: number;
  shippingMethodId?: number;
  categoryId?: number;
}

export interface Dates {
  createdAt?: object;
  updatedAt?: object;
}

export type Product = ProductInfo & ProductReferences & Dates;

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
    createdAt?: string;
    updatedAt?: string;
}

export type Product = ProductInfo & ProductReferences & Dates;

export interface ProductWithId extends Product {
    id: number;
}

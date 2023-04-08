import { Multimedia } from '../../src/layer/common/types/multimedia';

export interface ProductInfo {
  name: string;
  /*
   * @items.type integer
   * @items.minimum 0
   */
  price: number;
  totalQuantity: number;
  sellerId: number;
  categoryId: number;
  discount?: number;
  description?: string;
  address?: string;
  productStatusId?: number;
  shippingMethodId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductId = number;

export type Product = { id: ProductId } & ProductInfo;

export type ProductWithImg = Product & { img: Omit<Multimedia, 'productId'>[] };

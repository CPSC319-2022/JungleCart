import { Multimedia } from '../../src/layer/common/types/multimedia';

export interface ProductInfo {
  name: string;
  /**
   * @minimum 0
   */
  price: number;
  /**
   * @asType integer
   * @minimum 0
   */
  totalQuantity: number;
  /**
   * @asType integer
   * @minimum 0
   */
  sellerId: number;
  /**
   * @asType integer
   * @minimum 0
   */
  categoryId: number;
  /**
   * @minimum 0
   */
  discount?: number;
  description?: string;
  address?: string;
  productStatusId?: number;
  shippingMethodId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductId = number;

export type Product = {
  /**
   * @asType integer
   * @minimum 0
   */
  id: ProductId;
} & ProductInfo;

export type ProductWithImg = Product & { img: Omit<Multimedia, 'productId'>[] };

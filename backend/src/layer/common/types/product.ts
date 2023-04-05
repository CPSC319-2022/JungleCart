import { isImg, Multimedia } from '/opt/types/multimedia';
import { toType } from '/opt/types/database';

export interface ProductInfo {
  name: string;
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

const validateName = (name) =>
  typeof name === 'string' && name.length > 0 && name.length <= 200;
const validatePrice = (price) => typeof price === 'number' && price >= 0;
const validateTotalQuantity = (totalQuantity) =>
  typeof totalQuantity === 'number' &&
  totalQuantity >= 0 &&
  Number.isInteger(totalQuantity);
const validateSellerId = (sellerId) =>
  typeof sellerId === 'number' && sellerId >= 0 && Number.isInteger(sellerId);

const validateCategoryId = (categoryId) =>
  typeof categoryId === 'number' &&
  categoryId >= 0 &&
  Number.isInteger(categoryId);

const validateAddress = (address) =>
  typeof address === 'string' ? address.length < 255 : true;

function callValidateOnProductKey(key, value) {
  switch (key) {
    case 'name':
      return validateName(value);
    case 'price':
      return validatePrice(value);
    case 'totalQuantity':
      return validateTotalQuantity(value);
    case 'sellerId':
      return validateSellerId(value);
    case 'categoryId':
      return validateCategoryId(value);
    case 'address':
      return validateAddress(value);
    default:
      return true;
  }
}

export function isProductInfo(value): value is ProductInfo {
  const requiredKeys = [
    'name',
    'price',
    'totalQuantity',
    'sellerId',
    'categoryId',
  ];

  return (
    isOptionalProductInfo(value) && requiredKeys.every((key) => key in value)
  );
}

export function isOptionalProductInfo(value): value is Partial<ProductInfo> {
  return (
    !!value &&
    typeof value === 'object' &&
    Object.keys(value).every((key) => callValidateOnProductKey(key, value[key]))
  );
}

export type ProductId = number;

export function isProductId(value): value is ProductId {
  return value && typeof value === 'number' && Number.isInteger(value);
}

export type Product = { id: ProductId } & ProductInfo;

export function isProduct(value): value is Product {
  return isProductInfo(value) && isProductId(value['id']);
}

export function toProduct(rowDataPacket): Product | undefined {
  return toType<Product>(rowDataPacket, isProduct);
}

export type ProductWithImg = Product & { img: Omit<Multimedia, 'productId'>[] };

export function isProductWithImg(value): value is ProductWithImg {
  return isProduct(value) && isImg(value['img']);
}

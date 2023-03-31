import { Multimedia } from '/opt/models/product/types/multimedia';
import { RowDataPacket, toType } from '/opt/models/product/types/query-result';

interface RequiredProductInfo {
  name: string;
  price: number;
  totalQuantity: number;
  sellerId: number;
}

function isRequiredProductInfo(value): value is RequiredProductInfo {
  const validateName = (name) =>
    !!name && typeof name === 'string' && name.length <= 200;
  const validatePrice = (price) => !!price && typeof price === 'number';
  const validateTotalQuantity = (totalQuantity) =>
    !!totalQuantity &&
    typeof totalQuantity === 'number' &&
    Number.isInteger(totalQuantity);
  const validateSellerId = (sellerId) =>
    !!sellerId && typeof sellerId === 'number' && Number.isInteger(sellerId);

  return (
    !!value &&
    typeof value === 'object' &&
    validateName(value['name']) &&
    validatePrice(value['price']) &&
    validateTotalQuantity(value['totalQuantity']) &&
    validateSellerId(value['sellerId'])
  );
}

export function toRequiredProductInfo(
  rowDataPacket: RowDataPacket
): RequiredProductInfo | null {
  return toType<RequiredProductInfo>(rowDataPacket, isRequiredProductInfo);
}

interface OptionalProductInfo {
  discount?: number;
  description?: string;
  address?: string;
  productStatusId?: number;
  shippingMethodId?: number;
  categoryId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

function isOptionalProductInfo(value): value is OptionalProductInfo {
  const validateAddress = (address) => (address ? address.length < 255 : true);

  return (
    !!value && typeof value === 'object' && validateAddress(value['address'])
  );
}

export type ProductInfo = RequiredProductInfo & OptionalProductInfo;

export function isProductInfo(value): value is ProductInfo {
  return isRequiredProductInfo(value) && isOptionalProductInfo(value);
}

export type ProductId = number;

export function isProductId(value): value is ProductId {
  return value && typeof value === 'number' && Number.isInteger(value);
}

export type Product = { id: ProductId } & ProductInfo;

export function isProduct(product): product is Product {
  const { id, ...info } = product;
  return isProductId(id) && isProductInfo(info);
}

export function toProduct(rowDataPacket): Product | null {
  return toType<Product>(rowDataPacket, isProduct);
}

export type ProductWithImg = Product & { img: Omit<Multimedia, 'productId'>[] };

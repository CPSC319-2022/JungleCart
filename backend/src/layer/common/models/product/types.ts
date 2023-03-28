interface RequiredProductInfo {
  name: string;
  price: number;
  totalQuantity: number;
}

function isRequiredProductInfo(value): value is RequiredProductInfo {
  const validateName = (name) =>
    !!name && typeof name === 'string' && name.length <= 200;
  const validatePrice = (price) => !!price && typeof price === 'number';
  const validateTotalQuantity = (totalQuantity) =>
    !!totalQuantity &&
    typeof totalQuantity === 'number' &&
    Number.isInteger(totalQuantity);

  return (
    !!value &&
    typeof value === 'object' &&
    validateName(value['name']) &&
    validatePrice(value['price']) &&
    validateTotalQuantity(value['totalQuantity'])
  );
}

interface OptionalProductInfo {
  discount?: number;
  description?: string;
  address?: string;
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

export interface Category {
  id: number;
  name: string;
}

export function isCategory(value): value is Category {
  return (
    value &&
    typeof value === 'object' &&
    value['id'] &&
    typeof value['id'] === 'number' &&
    Number.isInteger(value['id']) &&
    value['name'] &&
    typeof value['name'] === 'string' &&
    value['name'].length <= 100
  );
}

export function toCategory(value): Category | null {
  return isCategory(value) ? { id: value.id, name: value.name } : null;
}

export namespace Search {
  export interface Filter {
    search?: string;
    categoryId?: number;
  }

  export interface Order {
    by?: string[];
    direction?: 'ASC' | 'DESC';
  }

  export interface Pagination {
    page: number;
    limit: number;
  }
}

export interface Multimedia {
  id: number;
  productId: number;
  url: string;
}

export function isMultimedia(value): value is Multimedia {
  return (
      value &&
      typeof value === 'object' &&
      value['id'] &&
      typeof value['id'] === 'number' &&
      Number.isInteger(value['id']) &&
      value['productId'] &&
      typeof value['productId'] === 'number' &&
      Number.isInteger(value['productId']) &&
      value['url'] &&
      typeof value['url'] === 'string' &&
      value['url'].length <= 200
  );
}

export function toMultimedia(value) : Multimedia | null {
  return isMultimedia(value) ? { id: value.id, productId: value.productId, url: value.url} : null;
}

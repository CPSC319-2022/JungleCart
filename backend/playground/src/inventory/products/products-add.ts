import { Product, ProductInfo } from '../../../type/product';

exports.handler = async function addProduct(
  productInfo: ProductInfo
): Promise<Product> {
  productInfo['id'] = 34;
  return productInfo as Product;
};

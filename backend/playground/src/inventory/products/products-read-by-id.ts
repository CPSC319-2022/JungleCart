import { Product, ProductId } from '../../../type/product';

exports.handler = async function getProductById(
  productId: ProductId
): Promise<Product> {
  return {
    id: productId,
    name: 'prod',
    price: 1.2,
    totalQuantity: 1,
    sellerId: 1,
    categoryId: 1,
  };
};

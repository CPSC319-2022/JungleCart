import { Product, ProductInfo } from '../../../type/product';

exports.handler = async (productInfo: ProductInfo): Promise<Product> => {
  return await getProductById(productInfo);
};

async function getProductById(productInfo: ProductInfo): Promise<Product> {
  return { id: 1, ...productInfo };
}

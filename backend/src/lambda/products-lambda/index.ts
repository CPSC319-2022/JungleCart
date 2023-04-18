import { Bucket, isBucket } from '/opt/types/multimedia';

import ProductController from './controller';

import Router, { ResponseContent } from '/opt/core/Router';
import { ProductByIdCompositeModel } from '/opt/models/product/composite/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/composite/ProductsCompositeModel';
import mySqlFacade from '/opt/core/SQLManager';

// Create bucket if defined
const bucket: Partial<Bucket> = {
  name: process.env.S3_NAME,
  region: process.env.S3_REGION,
};

// Create models
const productByIdCompositeModel = new ProductByIdCompositeModel(
  mySqlFacade,
  isBucket(bucket) ? bucket : undefined
);

const productsCompositeModel = new ProductsCompositeModel(mySqlFacade);

// Create controller
const controller: ProductController = new ProductController(
  productByIdCompositeModel,
  productsCompositeModel
);

// Set routing
const router: Router = new Router();
router.get('/products', controller.getProducts);
router.post('/products', controller.addProduct);
router.get('/products/{productId}', controller.getProductById);
router.patch('/products/{productId}', controller.updateProductById);
router.delete('/products/{productId}', controller.deleteProductById);

// Handler for invoking routing
exports.handler = async (event): Promise<ResponseContent> => {
  const ret = await router.route(event);
  await mySqlFacade.end();
  return ret;
};

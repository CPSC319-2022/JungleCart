import ProductController from './controller';
import ProductModel from '/opt/models/product/ProductModel';
import ProductListModel from '/opt/models/product/ProductSearchModel';
import CategoryModel from '/opt/models/product/CategoryModel';
import MultimediaModel from '/opt/models/product/MultimediaModel';

import Router, { ResponseContent } from '/opt/core/Router';
import { ProductByIdCompositeModel } from '/opt/models/product/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/ProductsCompositeModel';
import { Bucket } from '/opt/models/product/types/multimedia';
import process from 'process';

// create MVC
const bucket: Bucket | undefined =
  process.env.NAME && process.env.REGION
    ? { name: process.env.NAME, region: process.env.REGION }
    : undefined;

const productMultimediaModel = new ProductByIdCompositeModel(
  ProductModel,
  MultimediaModel,
  bucket
);

const productsMultimediaModel = new ProductsCompositeModel(
  ProductListModel,
  CategoryModel,
  MultimediaModel
);

const controller: ProductController = new ProductController(
  productMultimediaModel,
  productsMultimediaModel
);

// set routing
const router: Router = new Router();
router.post('/products', controller.addProduct);
router.delete('/products/{productId}', controller.deleteProductById);
router.get('/products/{productId}', controller.getProductById);
router.patch('/products/{productId}', controller.updateProductById);
router.get('/products', controller.getProducts);

// handles routing and sends request
exports.handler = async (event): Promise<ResponseContent> => {
  return await router.route(event);
};

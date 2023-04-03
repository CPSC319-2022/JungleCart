import { Bucket, isBucket } from '/opt/types/multimedia';
import { ConnectionParameters, DatabaseApi } from '/opt/types/database';

import ProductController from './controller';

import Router, { ResponseContent } from '/opt/core/Router';
import { ProductByIdCompositeModel } from '/opt/models/product/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/ProductsCompositeModel';
import { sqlDatabase } from '/opt/core/SQLManager';

// Create bucket if defined
const bucket: Partial<Bucket> = {
  name: process.env.S3_NAME,
  region: process.env.S3_REGION,
};

// Create db connection
const connectionParameters: Partial<ConnectionParameters> = {
  database: process.env.RDS_DATABASE,
  hostname: process.env.RDS_HOSTNAME,
  password: process.env.RDS_PASSWORD,
  port: Number(process.env.RDS_PORT),
  username: process.env.RDS_USERNAME,
};

const database: DatabaseApi = new sqlDatabase();
database.createConnectionPool(connectionParameters);

// Create models
const productMultimediaModel = new ProductByIdCompositeModel(
  database,
  isBucket(bucket) ? bucket : undefined
);

const productsMultimediaModel = new ProductsCompositeModel(database);

// Create controller
const controller: ProductController = new ProductController(
  productMultimediaModel,
  productsMultimediaModel
);

// Set routing
const router: Router = new Router();
router.post('/products', controller.addProduct);
router.delete('/products/{productId}', controller.deleteProductById);
router.get('/products/{productId}', controller.getProductById);
router.patch('/products/{productId}', controller.updateProductById);
router.get('/products', controller.getProducts);

// Handler for invoking routing
exports.handler = async (event): Promise<ResponseContent> => {
  return await router.route(event);
};

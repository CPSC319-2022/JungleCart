import { Bucket, isBucket } from '/opt/types/multimedia';
import {
  ConnectionParameters,
  isConnectionParameters,
  MySqlDatabaseApi,
} from '/opt/types/database';

import ProductController from './controller';

import Router, { ResponseContent } from '/opt/core/Router';
import { ProductByIdCompositeModel } from '/opt/models/product/composite/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/composite/ProductsCompositeModel';
import { MySqlPoolDatabaseApi } from '/opt/core/SQLManager';

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

const mySqlDatabaseApi: MySqlDatabaseApi = new MySqlPoolDatabaseApi();
mySqlDatabaseApi.create(
  isConnectionParameters(connectionParameters)
    ? connectionParameters
    : undefined
);

// Create models
const productByIdCompositeModel = new ProductByIdCompositeModel(
  mySqlDatabaseApi,
  isBucket(bucket) ? bucket : undefined
);

const productsCompositeModel = new ProductsCompositeModel(mySqlDatabaseApi);

// Create controller
const controller: ProductController = new ProductController(
  productByIdCompositeModel,
  productsCompositeModel
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

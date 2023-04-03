import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
import { expect } from 'chai';

import { Response, Request, Result } from '/opt/core/Router';

import ProductController from '@/lambdas/products-lambda/controller';

import { ProductByIdCompositeModel } from '/opt/models/product/composite/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/composite/ProductsCompositeModel';

import { isProductWithImg, Product, ProductWithImg } from "/opt/types/product";

import file from '../../../events/products/img.json';
import { ConnectionParameters, MySqlDatabaseApi } from '/opt/types/database';
import { MySqlPoolDatabaseApi } from '/opt/core/SQLManager';
import { Bucket } from '/opt/types/multimedia';
import NetworkError from "/opt/core/NetworkError";

describe('Integration tests for Products', function () {
  let connectionParameters: ConnectionParameters;
  let database: MySqlDatabaseApi;
  let bucket: Bucket;

  let controller: ProductController;

  before(() => {
    connectionParameters = {
      hostname: 'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
      username: 'admin',
      password: 'PeterSmith319',
      port: 3306,
      database: 'test',
    };

    database = new MySqlPoolDatabaseApi();
    database.create(connectionParameters);

    bucket = {
      name: 's3stack-mybucketf68f3ff0-l6prx12lvgew',
      region: 'ca-central-1'
    };
  });

  beforeEach(() => {
    controller = new ProductController(
      new ProductByIdCompositeModel(database, bucket),
      new ProductsCompositeModel(database)
    );
  });

  describe('addProduct', () => {
    it('add one product', async () => {
      const mockRequest: Request = {
        body: {
          name: 'controller-test-add',
          price: 2.5,
          totalQuantity: 3,
          sellerId: 1,
          img: [
            {
              url: 'https://th.bing.com/th/id/OIP.2nNDXE2kl9Mhj-L-xSLvOwHaEK?pid=ImgDet&rs=1',
            },
            {
              type: 'image/png',
              data: file,
            },
          ],
        },
        params: undefined,
        query: undefined,
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await controller.addProduct(
        mockRequest,
        mockResponse
      );

      const productWithImg: ProductWithImg = result.get();

      console.log(productWithImg);
    });
  });

  describe('getProductById', function () {
    it('Happy: minimum', async () => {
      const mockRequest: Request = {
        body: undefined,
        params: {
          productId: 1,
        },
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await controller.getProductById(
        mockRequest,
        mockResponse
      );

      const product: Product = result.get();

      expect(isProductWithImg(product)).to.be.true;
      expect(product.id).to.equal(mockRequest.params.productId);
    });

    it('Sad: invalid content', async () => {
      const mockRequest: Request = {
        body: undefined,
        params: {
          productId: 0,
        },
      };

      const mockResponse: Response = new Response(() => null);

      expect(controller.getProductById(
        mockRequest,
        mockResponse
      )).to.eventually.throw(NetworkError.UNPROCESSABLE_CONTENT);
    });
  });

  describe('updateProductById', () => {});

  describe('deleteProductById', () => {
    it('Happy: add then delete one product', async () => {
      const mockRequest: Request = {
        body: {
          name: 'controller-test-add-then-delete',
          price: 2.5,
          totalQuantity: 3,
          sellerId: 9,
          categoryId: 1,
          img: [
            {
              url: 'https://th.bing.com/th/id/OIP.2nNDXE2kl9Mhj-L-xSLvOwHaEK?pid=ImgDet&rs=1',
            },
            {
              type: 'image/png',
              data: file,
            },
          ],
        },
        params: undefined,
        query: undefined,
      };

      const mockResponse: Response = new Response(() => null);

      const productWithImg: ProductWithImg = (
        await controller.addProduct(mockRequest, mockResponse)
      ).get();

      const result: Result = await controller.deleteProductById(
        { ...mockRequest, params: { productId: productWithImg.id } },
        mockResponse
      );

      const deleted: boolean = result.get();

      expect(deleted).to.be.true;
    });
  });

  describe('getProducts', () => {
    it('Happy: getting 10 or less products', async function () {
      const mockRequest: Request = {
        body: undefined,
        query: {
          page: '1',
          limit: '10',
        },
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await controller.getProducts(
        mockRequest,
        mockResponse
      );

      const productList: ProductWithImg[] = result.get();

      expect(productList).to.be.an.instanceof(Array);
      expect(productList.every(isProductWithImg));
      expect(productList.length).to.be.lessThanOrEqual(
        Number(mockRequest.query.limit)
      );
    });
  });
});

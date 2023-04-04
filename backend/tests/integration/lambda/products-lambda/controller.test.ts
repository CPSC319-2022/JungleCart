import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import { Response, Request, Result } from '/opt/core/Router';
import { MySqlPoolDatabaseApi } from '/opt/core/SQLManager';
import NetworkError from '/opt/core/NetworkError';

import ProductController from '@/lambdas/products-lambda/controller';

import { ProductByIdCompositeModel } from '/opt/models/product/composite/ProductByIdCompositeModel';
import { ProductsCompositeModel } from '/opt/models/product/composite/ProductsCompositeModel';

import { isProductWithImg, Product, ProductWithImg } from '/opt/types/product';
import { ConnectionParameters, MySqlDatabaseApi } from '/opt/types/database';
import { Bucket } from '/opt/types/multimedia';

import file from '../../../events/products/img.json';
import Sinon from 'sinon';

describe('Product Controller Integration Tests', () => {
  let connectionParameters: ConnectionParameters;
  let database: MySqlDatabaseApi;
  let bucket: Bucket;

  let controller: ProductController;
  let stubResolve: Sinon.SinonStub;
  let mockResponse: Response = new Response(() => null);

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
      region: 'ca-central-1',
    };
  });

  beforeEach(() => {
    controller = new ProductController(
      new ProductByIdCompositeModel(database, bucket),
      new ProductsCompositeModel(database)
    );

    stubResolve = Sinon.stub();
    mockResponse = new Response(stubResolve);
  });

  describe('addProduct', () => {
    it('Happy: file and url images', async () => {
      const mockRequest: Request = {
        body: {
          name: 'controller-test-add',
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
      };

      const result: Result = await controller.addProduct(
        mockRequest,
        mockResponse
      );

      expect(stubResolve.calledOnce).to.be.true;

      const productWithImg: ProductWithImg = result.get();

      expect(isProductWithImg(productWithImg)).to.be.true;
      expect(productWithImg.id).to.equal(mockRequest.params.productId);
    });

    it('Sad: undefined ProductByIdCompositeModel', () => {
      controller = new ProductController(undefined);

      const mockRequest: Request = {
        body: undefined,
      };

      expect(controller.addProduct(mockRequest, mockResponse)).to.eventually
        .throw;

      expect(stubResolve.calledOnce).to.be.true;
    });
  });

  describe('getProductById', function () {
    it('Happy: for id 1', async () => {
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

      expect(stubResolve.calledOnce).to.be.true;

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

      expect(
        controller.getProductById(mockRequest, mockResponse)
      ).to.eventually.throw(NetworkError.UNPROCESSABLE_CONTENT);

      expect(stubResolve.calledOnce).to.be.true;
    });

    it('Sad: undefined ProductByIdCompositeModel', () => {
      controller = new ProductController(undefined);

      const mockRequest: Request = {
        body: undefined,
      };

      expect(controller.getProductById(mockRequest, mockResponse)).to.eventually
        .throw;

      expect(stubResolve.calledOnce).to.be.true;
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

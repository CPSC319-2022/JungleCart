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
      password: 'PeterSmithIsCool',
      port: 3306,
      database: 'test',
    };

    database = new MySqlPoolDatabaseApi();
    database.create(connectionParameters);

    bucket = {
      name: 's3stack-mybucketf68f3ff0-zrrasck3o2ag',
      region: 'us-west-1',
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
      Object.entries(mockRequest.body).map(([key, value]) => {
        if (typeof value !== 'object') {
          expect(productWithImg[key]).to.equal(value);
        }
      });
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

  describe('updateProductById', () => {
    it('Happy: updated product', async () => {
      const mockCreateRequest: Request = {
        body: {
          name: 'controller-test-add-then-update-post',
          price: 2.5,
          totalQuantity: 3,
          sellerId: 9,
          categoryId: 1,
          img: [
            {
              type: 'image/png',
              data: file,
            },
          ],
        },
      };

      const createdProduct: ProductWithImg = (
        await controller.addProduct(mockCreateRequest, mockResponse)
      ).get();

      const mockUpdateRequest: Request = {
        body: {
          name: 'controller-test-add-then-update-patch',
          price: 2.5,
          totalQuantity: 2,
          img: [],
        },
        params: {
          productId: createdProduct.id,
        },
      };

      const updatedProduct: ProductWithImg = (
        await controller.updateProductById(mockUpdateRequest, mockResponse)
      ).get();

      expect(createdProduct.id).to.equal(updatedProduct.id);

      // check keys return product is updated
      Object.keys(mockUpdateRequest.body).map((key) => {
        expect(updatedProduct[key]).to.deep.equal(mockUpdateRequest.body[key]);
      });

      // check that non-updated values are the same
      Object.keys(createdProduct).map((key) => {
        if (!(key in mockUpdateRequest.body)) {
          expect(updatedProduct[key]).to.deep.equal(createdProduct[key]);
        }
      });
    });
  });

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

      const productWithImg: ProductWithImg = (
        await controller.addProduct(mockRequest, mockResponse)
      ).get();

      const deleted: boolean = (
        await controller.deleteProductById(
          { ...mockRequest, params: { productId: productWithImg.id } },
          mockResponse
        )
      ).get();

      expect(deleted).to.be.true;
    });
  });

  describe('getProducts', () => {
    it('Happy: getting default amount of products or less', async function () {
      const mockRequest: Request = {
        body: undefined,
      };

      const productList: ProductWithImg[] = (
        await controller.getProducts(mockRequest, mockResponse)
      ).get();

      expect(productList).to.be.an.instanceof(Array);
      expect(productList.every(isProductWithImg));
    });

    it('Happy: search for non-existent product', async function () {
      const mockRequest: Request = {
        body: undefined,
        query: {
          search: `${Math.random()}-${Math.random()}-${Math.random()}`,
        },
      };

      const productList: ProductWithImg[] = (
        await controller.getProducts(mockRequest, mockResponse)
      ).get();

      console.log(productList);

      expect(productList).to.be.an.instanceof(Array);
      expect(productList).length(0);
    });

    it('Happy: getting second page', async function () {
      const mockRequest: Request = {
        body: undefined,
        query: {
          page: '1',
          limit: '2',
        },
      };

      const firstPage: ProductWithImg[] = (
        await controller.getProducts(mockRequest, mockResponse)
      ).get();

      expect(firstPage).to.be.an.instanceof(Array);
      expect(firstPage.every(isProductWithImg));
      expect(firstPage.length).to.be.lessThanOrEqual(
        Number(mockRequest.query.limit)
      );

      mockRequest.query.page = 2;

      const secondPage: ProductWithImg[] = (
        await controller.getProducts(mockRequest, mockResponse)
      ).get();

      expect(secondPage).to.be.an.instanceof(Array);
      expect(secondPage.every(isProductWithImg));
      expect(secondPage.length).to.be.lessThanOrEqual(
        Number(mockRequest.query.limit)
      );
      expect(secondPage.length).to.be.lessThanOrEqual(firstPage.length);
      if (firstPage.length && secondPage.length) {
        expect(secondPage).to.not.include.members(firstPage);
      }
    });

    it('Happy: add then filter for product', async function () {
      const mockAddRequest: Request = {
        body: {
          name: `controller-test-get-all-${Math.random()}`,
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

      const productWithImg: ProductWithImg = (
        await controller.addProduct(mockAddRequest, mockResponse)
      ).get();

      expect(stubResolve.calledOnce).to.be.true;

      const mockGetRequest: Request = {
        body: undefined,
        query: {
          search: mockAddRequest.body.name,
          page: '1',
          limit: '10',
        },
      };

      const productList: ProductWithImg[] = (
        await controller.getProducts(mockGetRequest, mockResponse)
      ).get();

      expect(stubResolve.calledTwice).to.be.true;
      expect(productList).to.be.an.instanceof(Array);
      expect(productList.length).to.equal(1);
      expect(productList.every(isProductWithImg));
      expect(productList.at(0)).to.deep.equal(productWithImg);
    });
  });

  after(async () => {
    controller = new ProductController(
      new ProductByIdCompositeModel(database, bucket),
      new ProductsCompositeModel(database)
    );

    const mockRequest: Request = {
      body: undefined,
      query: {
        search: 'controller-',
        limit: '10000',
      },
    };

    mockResponse = new Response(Sinon.stub());

    const productList: ProductWithImg[] = (
      await controller.getProducts(mockRequest, mockResponse)
    ).get();

    const promiseList = productList.map((product) => {
      controller.deleteProductById(
        { body: undefined, params: { productId: product.id } },
        mockResponse
      );
    });

    await Promise.all(promiseList);
  });
});

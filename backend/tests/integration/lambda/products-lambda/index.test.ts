import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';
import fs from 'fs';

import { Response, ResponseContent, Request, Result } from '/opt/core/router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handler } = require('@/lambdas/products-lambda/index');
import ProductController from '@/lambdas/products-lambda/controller';

describe('Unit tests for Products', function () {
  describe('When getting Products', function () {
    let getProductByIdEvent;
    let getProductsEvent;

    before('load event data for products', async () => {
      getProductByIdEvent = loadEventFromFile(
        'tests/events/products/get-products-{productId}.json'
      );
      getProductsEvent = loadEventFromFile(
        'tests/events/products/get-products.json'
      );
    });

    it('ROUTER - getting a product', async () => {
      const responseResult: ResponseContent = await handler(
        getProductByIdEvent
      );

      expect(responseResult.statusCode).to.equal(200);
    });

    it('CONTROLLER - getting all products', async function () {
      const productController: ProductController = new ProductController();

      const mockRequest: Request = {
        body: undefined,
        params: undefined,
        query: {
          search: "phone",
          category: "Electronics",
          order_by: "price",
          order_direction: "ASC",
          page: 1,
          limit: 1
        }
      };

      const mockResponse: Response = new Response(
        () => null,
        () => null
      );
      const productList: Result = await productController.getProducts(
          mockRequest, mockResponse
      );

      expect(productList.get()).to.be.an.instanceof(Array);
      expect(productList.get().length).to.be.greaterThan(0);
    });
  });

  describe('When adding Products', function () {
    return;
  });

  describe('When deleting Products', () => {
    return;
  });
  describe('When updating Products', () => {
    return;
  });
});

const loadEventFromFile = (filepath: string) => {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
};

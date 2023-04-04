import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import * as sinon from 'sinon';

import { Request, Response, Result } from '/opt/core/Router';

import ProductController from '@/lambdas/products-lambda/controller';
import ProductModel from '/opt/models/product/primitive/ProductModel';
import MultimediaModel from '/opt/models/product/primitive/MultimediaModel';
import { ProductByIdCompositeModel } from '/opt/models/product/composite/ProductByIdCompositeModel';
import NetworkError from '/opt/core/NetworkError';
import { Product } from '/opt/types/product';

describe('Unit tests for Products Controller', () => {
  describe('ProductById tests', () => {
    let productModelStub;
    let multimediaModelStub;
    let controller;
    let mockResponse: Response;

    beforeEach(() => {
      // productModelStub = new ProductModel();
      // multimediaModelStub = new MultimediaModel();
      //
      // mockResponse = new Response(() => null);
    });

    describe('getProductById tests', () => {
      //   it('getting a product that exists', async () => {
      //     productModelStub.read = sinon
      //       .stub()
      //       .resolves({ id: 1, name: 'Product 1' });
      //
      //     multimediaModelStub.read = sinon
      //       .stub()
      //       .resolves([{ id: 1, productId: 1, url: 'www.nope.com' }]);
      //
      //     controller = new ProductController(
      //       new ProductByIdCompositeModel(productModelStub, multimediaModelStub)
      //     );
      //
      //     const mockRequest: Request = {
      //       body: undefined,
      //       params: {
      //         productId: 1,
      //       },
      //       query: undefined,
      //     };
      //
      //     const result: Result = await controller.getProductById(
      //       mockRequest,
      //       mockResponse
      //     );
      //
      //     const product: Product = result.get();
      //
      //     expect(product).to.deep.equal({
      //       id: 1,
      //       name: 'Product 1',
      //       img: ['www.nope.com'],
      //     });
      //   });
      //
      //   it('no model was added', async () => {
      //     controller = new ProductController();
      //
      //     const mockRequest: Request = {
      //       body: undefined,
      //       params: {
      //         productId: 2,
      //       },
      //       query: undefined,
      //     };
      //
      //     try {
      //       await controller.getProductById(mockRequest, mockResponse);
      //       expect.fail();
      //     } catch (error) {
      //       expect(error).to.be.an.instanceof(NetworkError);
      //       expect((error as NetworkError).statusCode).to.equal(500);
      //     }
      //   });
    });
  });

  describe('getProducts tests', () => {
    // let productModelStub;
    // let multimediaModelStub;
    // let controller;
    // let mockResponse: Response;
    //
    // before(() => {
    //   productModelStub = new ProductModel();
    //   productModelStub.read = sinon
    //     .stub()
    //     .resolves({ id: 1, name: 'Product 1' });
    //
    //   multimediaModelStub = new MultimediaModel();
    //   multimediaModelStub.read = sinon
    //     .stub()
    //     .resolves([{ id: 1, productId: 1, url: 'www.nope.com' }]);
    //
    //   controller = new ProductController(
    //     new ProductCompositeModel(productModelStub, multimediaModelStub)
    //   );
    //
    //   mockResponse = new Response(
    //     () => null,
    //     () => null
    //   );
    // });
    //
    // it('getting all products', async () => {
    //   const mockRequest: Request = {
    //     body: undefined,
    //     params: undefined,
    //     query: {
    //       order_by: 'price',
    //       order_direction: 'ASC',
    //       page: '1',
    //       limit: '10',
    //     },
    //   };
    //
    //   const result: Result = await controller.getProducts(
    //     mockRequest,
    //     mockResponse
    //   );
    //
    //   const productList: Product[] = result.get();
    //
    //   expect(productList).to.be.an.instanceof(Array);
    //   expect(productList.length).to.be.equal(mockRequest.query.limit);
    // });
  });
});

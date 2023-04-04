// import * as chai from 'chai';
// import chaiAsPromised from 'chai-as-promised';
// import { expect } from 'chai';
// chai.use(chaiAsPromised);
// import * as sinon from 'sinon';
//
// import { Request, Response, Result } from '/opt/core/Router';
//
// import ProductController from '@/lambdas/products-lambda/controller';
// import { ProductModel } from '/opt/models/product/ProductModel';
// import { MultimediaModel } from '/opt/models/product/MultimediaModel';
// import { ProductByIdCompositeModel } from '/opt/models/product/ProductByIdCompositeModel';
// import NetworkError from '/opt/core/NetworkError';
// import { Product } from '/opt/types/product';
// import OrderController from "@/lambdas/orders-lambda/controller";
//
// describe('Unit tests for Orders Controller', () => {
//   let orderController = new OrderController();
//   before(() => {
//
//   });
//
//   describe('GetOrderById', () => {
//
//     it('should throw an error if order isn\'t found' , async () => {
//       orderController.getOrderById()
//     });
//
//     it('should return order matching order id' , async () => {
//
//     });
//   });
//
//
//   describe('ProductById tests', () => {
//     let productModelStub;
//     let multimediaModelStub;
//     let controller;
//     let mockResponse: Response;
//
//     beforeEach(() => {
//       productModelStub = new ProductModel();
//       multimediaModelStub = new MultimediaModel();
//
//       mockResponse = new Response(() => null);
//     });
//
//     describe('getProductById tests', () => {
//       it('getting a product that exists', async () => {
//         productModelStub.read = sinon
//           .stub()
//           .resolves({ id: 1, name: 'Product 1' });
//
//         multimediaModelStub.read = sinon
//           .stub()
//           .resolves([{ id: 1, productId: 1, url: 'www.nope.com' }]);
//
//         controller = new ProductController(
//           new ProductByIdCompositeModel(productModelStub, multimediaModelStub)
//         );
//
//         const mockRequest: Request = {
//           body: undefined,
//           params: {
//             productId: 1,
//           },
//           query: undefined,
//         };
//
//         const result: Result = await controller.getProductById(
//           mockRequest,
//           mockResponse
//         );
//
//         const product: Product = result.get();
//
//         expect(product).to.deep.equal({
//           id: 1,
//           name: 'Product 1',
//           img: ['www.nope.com'],
//         });
//       });
//
//       it('no model was added', async () => {
//         controller = new ProductController();
//
//         const mockRequest: Request = {
//           body: undefined,
//           params: {
//             productId: 2,
//           },
//           query: undefined,
//         };
//
//         try {
//           await controller.getProductById(mockRequest, mockResponse);
//           expect.fail();
//         } catch (error) {
//           expect(error).to.be.an.instanceof(NetworkError);
//           expect((error as NetworkError).statusCode).to.equal(500);
//         }
//       });
//     });
//   });
//
// });

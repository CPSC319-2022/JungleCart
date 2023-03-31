import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { expect } from 'chai';

import { Response, Request, Result, ResponseContent } from '/opt/core/Router';

import ProductController from '@/lambdas/products-lambda/controller';

import { ProductByIdCompositeModel } from '/opt/models/product/ProductByIdCompositeModel';
import ProductModel from '/opt/models/product/ProductModel';
import MultimediaModel from '/opt/models/product/MultimediaModel';
import { ProductsCompositeModel } from '/opt/models/product/ProductsCompositeModel';
import ProductSearchModel from '/opt/models/product/ProductSearchModel';
import CategoryModel from '/opt/models/product/CategoryModel';

import { Product, ProductWithImg } from '/opt/models/product/types/product';

import file from '../../../events/products/img.json';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handler } = require('@/lambdas/products-lambda/index');

import post from '../../../events/products/post.json';
import patch from '../../../events/products/patch.json';

describe('Integration tests for Products', function () {
  describe('When getting Products', function () {
    let ProductListModelStub;
    let controller;

    before(async () => {
      controller = new ProductController(
        new ProductByIdCompositeModel(ProductModel, MultimediaModel),
        new ProductsCompositeModel(
          ProductSearchModel,
          CategoryModel,
          MultimediaModel
        )
      );
    });

    it('getting a product', async () => {
      const productController: ProductController = controller;

      const mockRequest: Request = {
        body: undefined,
        params: {
          productId: 1,
        },
        query: undefined,
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await productController.getProductById(
        mockRequest,
        mockResponse
      );

      const product: Product = result.get();

      console.log(product);
    });

    it('failing to get a product', async () => {
      const productController: ProductController = controller;

      const mockRequest: Request = {
        body: undefined,
        params: {
          productId: 420,
        },
        query: undefined,
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await productController.getProductById(
        mockRequest,
        mockResponse
      );

      const product: Product = result.get();

      console.log(product);
    });

    it('getting 10 products', async function () {
      const productController: ProductController = controller;

      const mockRequest: Request = {
        body: undefined,
        params: undefined,
        query: {
          search: '',
          order_by: '',
          category: '',
          page: '1',
          limit: '10',
        },
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await productController.getProducts(
        mockRequest,
        mockResponse
      );

      const productList: ProductWithImg[] = result.get();

      expect(productList).to.be.an.instanceof(Array);
      expect(productList.length).to.be.equal(Number(mockRequest.query.limit));
    });
  });

  describe('When adding Products', () => {
    it('INDEX - add one product', async () => {
      const responseResult: ResponseContent = await handler(post);

      console.log(responseResult);
    });

    it('CONTROLLER - add one product', async () => {
      const productController: ProductController = new ProductController(
        new ProductByIdCompositeModel(ProductModel, MultimediaModel, {
          name: 's3stack-mybucketf68f3ff0-l6prx12lvgew',
          region: 'ca-central-1',
        }),
        new ProductsCompositeModel(
          ProductSearchModel,
          CategoryModel,
          MultimediaModel
        )
      );

      const mockRequest: Request = {
        body: {
          name: 'trust me bro',
          price: 2.5,
          totalQuantity: 3,
          sellerId: 1,
          img: {
            urls: [
              'https://th.bing.com/th/id/OIP.2nNDXE2kl9Mhj-L-xSLvOwHaEK?pid=ImgDet&rs=1',
            ],
            files: [file],
          },
        },
        params: undefined,
        query: undefined,
      };

      const mockResponse: Response = new Response(() => null);

      const result: Result = await productController.addProduct(
        mockRequest,
        mockResponse
      );

      const productWithImg: ProductWithImg = result.get();

      console.log(productWithImg);
    });
  });

  describe('When deleting Products', () => {
    return;
  });
  describe('When updating Products', () => {
    it('INDEX - update product', async () => {
      const responseResult: ResponseContent = await handler(patch);

      console.log(responseResult);
    });
  });
});

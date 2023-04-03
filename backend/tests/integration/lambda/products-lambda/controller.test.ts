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

import { Product, ProductWithImg } from '/opt/types/product';

import file from '../../../events/products/img.json';

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
      expect(productList.length).to.be.lessThanOrEqual(Number(mockRequest.query.limit));
    });
  });

  describe('When adding Products', () => {

    it('add one product', async () => {
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

      const result: Result = await productController.addProduct(
        mockRequest,
        mockResponse
      );

      const productWithImg: ProductWithImg = result.get();

      console.log(productWithImg);
    });
  });

  describe('When deleting Products', () => {
    it('delete one product', async () => {
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

      const productWithImg: ProductWithImg = (
        await productController.addProduct(mockRequest, mockResponse)
      ).get();

      const result: Result = await productController.deleteProductById(
        { ...mockRequest, params: { productId: productWithImg.id } },
        mockResponse
      );

      console.log(result.get());
    });
  });
  describe('When updating Products', () => {
  });
});

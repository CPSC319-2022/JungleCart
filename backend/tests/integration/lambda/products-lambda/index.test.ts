import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

import { ResponseContent } from '/opt/core/Router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handler } = require('@/lambdas/products-lambda/index');

import defaultDeleteEvent from '../../../events/products/delete.json';
import defaultGetManyEvent from '../../../events/products/get-all.json';
import defaultGetAllEmptyQueryParamsEvent from '../../../events/products/get-all-empty-query-params.json';
import defaultGetOneEvent from '../../../events/products/get-one.json';
import defaultPatchEvent from '../../../events/products/patch.json';
import defaultPostEvent from '../../../events/products/post.json';
import imgData from '../../../events/products/img.json';
import NetworkError from '/opt/core/NetworkError';
import { isProduct, isProductWithImg } from "/opt/types/product";
import { isImg } from "/opt/types/multimedia";

describe('Products Index Integration Tests', () => {
  describe('POST /products', () => {
    let postEvent;

    const generateRandomInt = () =>
      Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
    const generateRandomFloat = () => (Math.random() * 2) ^ 14;

    beforeEach(() => {
      postEvent = defaultPostEvent;
    });

    it('Happy: add one product with only required', async () => {
      postEvent['body'] = {
        name: 'add one product with only required',
        totalQuantity: generateRandomInt(),
        price: generateRandomFloat(),
        sellerId: generateRandomInt(),
        categoryId: 1,
      };

      const responseResult: ResponseContent = await handler(postEvent);

      expect(responseResult.statusCode).to.equal(201);

      const product = JSON.parse(responseResult.body);

      expect(isProduct(product)).to.be.true;
    });

    it('Happy: add one product with file img', async () => {
      postEvent['body'] = {
        name: 'add one product with file img',
        totalQuantity: 2,
        price: 2.3,
        sellerId: 1,
        img: [
          {
            type: 'image/png',
            data: imgData,
          },
        ],
      };

      const responseResult: ResponseContent = await handler(postEvent);

      expect(responseResult.statusCode).to.equal(201);

      const product = JSON.parse(responseResult.body);

      expect(isProductWithImg(product)).to.be.true;
      expect(product.img.length).to.equal(1);
      expect(product.img.at(0).url).to.include('s3');
    });

    it('Happy: add one product with url img', async () => {
      postEvent['body'] = {
        name: 'add one product with url img',
        totalQuantity: 2,
        price: 2.3,
        sellerId: 1,

        img: [
          {
            url: 'https://en.wikipedia.org/wiki/File:Image_created_with_a_mobile_phone.png',
          },
        ],
      };

      const responseResult: ResponseContent = await handler(postEvent);

      expect(responseResult.statusCode).to.equal(201);

      const product = JSON.parse(responseResult.body);

      expect(isProductWithImg(product)).to.be.true;
      expect(product.img.length).to.equal(1);
    });

    it('failing to add one product missing required', async () => {
      const responseResult: ResponseContent = await handler(postEvent);

      expect(responseResult.statusCode).to.equal(
        NetworkError.UNPROCESSABLE_CONTENT.statusCode
      );
    });
  });

  describe('GET /products', () => {
    let getManyEvent;

    beforeEach(() => {
      getManyEvent = defaultGetManyEvent;
    });

  });

  describe('GET /products/{productId}', () => {
    let getOneEvent;

    beforeEach(() => {
      getOneEvent = defaultGetOneEvent;
    });

    it('Happy: get one product', async () => {
      getOneEvent['pathParameters'] = {
        productId: '1',
      };

      const responseResult: ResponseContent = await handler(getOneEvent);

      expect(responseResult.statusCode).to.equal(200);

      const product = JSON.parse(responseResult.body);

      expect(typeof product).to.equal('object');
      expect(isProductWithImg(product)).to.be.true;
    });

    it('Sad: invalid product id', async () => {
      getOneEvent['pathParameters'] = {
        productId: '0',
      };

      const responseResult: ResponseContent = await handler(getOneEvent);

      expect(responseResult.statusCode).to.equal(
        NetworkError.NOT_FOUND.statusCode
      );
    });
  });

  describe('DELETE /products', () => {
    let deleteEvent;

    it('Happy: add and delete one product', async () => {

      const responseResult: ResponseContent = await handler(deleteEvent);

      console.log(responseResult);
    });
  });

  describe('When updating Products', () => {
    let patchEvent;

    it('update product', async () => {
      const responseResult: ResponseContent = await handler(patchEvent);

      console.log(responseResult);
    });
  });
});

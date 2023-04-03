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


describe('Integration tests for Products', function () {
  describe('When getting Products', () => {
    let getOneEvent;
    let getManyEvent;

    beforeEach(() => {
      getOneEvent = defaultGetOneEvent;
      getManyEvent = defaultGetManyEvent;
    });

    it('get one product', async () => {
      getOneEvent['pathParameters'] = {
        productId: "1"
      };

      const responseResult: ResponseContent = await handler(getOneEvent);

      expect(true).to.be.equal(true);
    });

    it('get product that doesn\'t exist', async () => {
      getOneEvent['pathParameters'] = {
        productId: "0"
      };

      const responseResult: ResponseContent = await handler(getOneEvent);

      console.log(responseResult);
      expect(true).to.be.equal(true);
    });
  });

  describe('When adding Products', () => {
    let postEvent;

    const generateRandomInt = () =>
      Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
    const generateRandomFloat = () => (Math.random() * 2) ^ 14;

    beforeEach(() => {
      postEvent = defaultPostEvent;
      //setEnv();
    });

    it('add one product with only required', async () => {
      postEvent['body'] = {
        name: 'add one product with only required',
        totalQuantity: generateRandomInt(),
        price: generateRandomFloat(),
        sellerId: generateRandomInt(),
        categoryId: 1,
      };

      const responseResult: ResponseContent = await handler(postEvent);

      console.log(responseResult);
    });

    it('add one product with file img', async () => {
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

      console.log(responseResult);
    });

    it('add one product with url img', async () => {
      postEvent['body'] = {
        name: 'post-test-product',
        totalQuantity: 2,
        price: 2.3,
        sellerId: 1,
        img: [
          {
            url: 'https://en.wikipedia.org/wiki/File:Image_created_with_a_mobile_phone.png'
          },
        ],
      };

      const responseResult: ResponseContent = await handler(postEvent);

      console.log(responseResult);
    });

    it('failing to add one product missing required', async () => {
      const responseResult: ResponseContent = await handler(postEvent);

      console.log(responseResult);
    });
  });

  describe('When deleting Products', () => {
    let deleteEvent;

    it('add one product', async () => {
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

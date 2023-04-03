import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import { ResponseContent } from '/opt/core/Router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handler } = require('@/lambdas/products-lambda/index');

import deleteEvent from '../../../events/products/delete.json';
import getAllEvent from '../../../events/products/get-all.json';
import getAllEmptyQueryParamsEvent from '../../../events/products/get-all-empty-query-params.json';
import getOneEvent from '../../../events/products/get-one.json';
import patchEvent from '../../../events/products/patch.json';
import defaultPostEvent from '../../../events/products/post.json';
import imgData from '../../../events/products/img.json';

function setEnv() {
  process.env.S3_BUCKET = 's3stack-mybucketf68f3ff0-l6prx12lvgew';
  process.env.S3_REGION = 'ca-central-1';

  process.env.RDS_DATABASE = 'test';
  process.env.RDS_HOSTNAME = 'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com';
  process.env.RDS_PASSWORD = 'PeterSmith319';
  process.env.RDS_PORT = '3306';
  process.env.RDS_USERNAME = 'admin';
}

describe('Integration tests for Products', function () {
  describe('When getting Products', () => {
    it('get one product', async () => {
      const responseResult: ResponseContent = await handler(getOneEvent);

      console.log(responseResult);
      expect(true).to.be.equal(true);
    });
    it('get one product', async () => {
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
      setEnv();
    });

    it('add one product with only required', async () => {
      console.log(this.ctx.currentTest?.title);
      postEvent['body'] = {
        name: 'post-test-product',
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
        name: 'post-test-product',
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
            type: '',
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

    after(() => {
      console.log('after', this);
    });
  });

  describe('When deleting Products', () => {
    it('add one product', async () => {
      const responseResult: ResponseContent = await handler(defaultPostEvent);

      console.log(responseResult);
    });
  });

  describe('When updating Products', () => {
    it('update product', async () => {
      const responseResult: ResponseContent = await handler(patchEvent);

      console.log(responseResult);
    });
  });
});

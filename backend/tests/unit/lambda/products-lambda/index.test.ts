import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import * as sinon from 'sinon';

import * as data from '../../../events/products/get-products-{productId}.json';

import { Response } from '/opt/core/router';

import ProductController from '@/lambdas/products-lambda/controller';
import SQLManager from '/opt/core/SQLManager';

describe('Unit tests for Products', () => {
  let stub;
  let controller;
  let response: Response;

  before(() => {
    stub = sinon.stub(SQLManager, 'createConnectionPool');
    controller = new ProductController();
    response = new Response(
      () => {
        /* nothing */
      },
      () => {
        /* nothing */
      }
    );

    describe('When getting Products', () => {
      it('should throw an error if product id is missing', async () => {
        const body = data;
        expect(controller.getProductById(body, response)).to.eventually.be
          .rejected;
      });

      it('should successfully get product info', () => {
        const body = data;
        expect(controller.getProductById(body, response)).to.eventually.be
          .fulfilled;
      });
    });

    describe('When adding Products', () => {
      it('should throw an error if product information is incomplete');
      it('should successfully add a product');
    });

    it('should throw an error if product id is missing', async () => {
      const body = data;
      expect(controller.getProductById(body, response)).to.eventually.be
        .rejected;
    });

    it('should successfully get product info', () => {
      const body = data;
      expect(controller.getProductById(body, response)).to.eventually.be
        .fulfilled;
    });
  });

  describe('When adding Products', () => {
    it('should throw an error if product information is incomplete');
    it('should successfully add a product');
  });

  describe('When deleting Products', () => {
    return;
  });
  describe('When updating Products', () => {
    return;
  });

  after(() => {
    stub.restore();
  });
});

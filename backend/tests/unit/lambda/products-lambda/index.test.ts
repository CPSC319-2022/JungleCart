import { addProduct } from '@/lambdas/products-lambda';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import * as sinon from 'sinon';
import * as data from '../../../events/get_product_id.json';
import { SQLConnectionManager } from '/opt/sql-layer';

describe('Unit tests for Products', function () {
  let stub;

  before(() => {
    stub = sinon.stub(SQLConnectionManager, 'createConnection');
  });

  describe('When getting Products', function () {
    it('should throw an error if product id is missing', async () => {
      const event = data;
      expect(addProduct(event)).to.eventually.be.rejected;
    });
    it('should successfully get product info');
  });

  describe('When adding Products', function () {
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

import * as data from 'tests/events/event-order-1.json';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import * as sinon from 'sinon';
import SQLManager from '/opt/common/SQLManager';
import { handleOrder } from '@/lambdas/order-lambda';

describe('Unit tests for Authentication', function () {
  let stub;

  before(() => {
    stub = sinon.stub(SQLManager, 'createConnectionPool');
  });
  it('should throw an error if user email is missing from event', async () => {
    const event = data;
    expect(handleOrder(event)).to.eventually.be.rejected;
  });

  after(() => {
    stub.restore();
  });
});

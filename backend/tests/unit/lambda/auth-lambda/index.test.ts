import { authorizeLogin } from '@/lambdas/auth-lambda';
import * as data from 'tests/events/event-sign-in.json';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import * as sinon from 'sinon';
import SQLManager from '/opt/core/SQLManager';

describe('Unit tests for Authentication', function () {
  let stub;

  before(() => {
    stub = sinon.stub(SQLManager, 'create');
  });
  it('should throw an error if user email is missing from event', async () => {
    const event = data;
    expect(authorizeLogin(event)).to.eventually.be.rejected;
  });

  //   after(() => {
  //     stub.restore();
  //   });
});

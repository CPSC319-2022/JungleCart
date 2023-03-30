import { authorizeLogin } from '@/lambdas/auth-lambda';
import * as data2 from 'tests/events/event-sign-in2.json';
import * as data3 from 'tests/events/event-sign-in3.json';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);

describe('Integration tests for Authentication', function () {
  it('should throw if user email is not a registered user', async () => {
    const event = data2;
    expect(authorizeLogin(event)).to.eventually.be.rejected;
  });

  it('should return if user email is a registered user', async () => {
    const event = data3;
    expect(authorizeLogin(event)).to.not.eventually.be.rejected;
  });

  it('should throw an error if server user query fails');
});

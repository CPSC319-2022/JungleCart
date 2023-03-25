import { ResponseContent, Router } from '/opt/common/router';
import { asyncWrap } from '/opt/common/async-wrap';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect, should, assert } from 'chai';
import * as sinon from 'sinon';
import UserController from '@/lambdas/users-lambda/UserController';
import UserService from '@/lambdas/users-lambda/UserService';
import UserModel from '@/lambdas/users-lambda/UserModel';
import * as data from 'tests/events/user/data';
import SQLManager from '/opt/common/SQLManager';

chai.use(chaiAsPromised);

describe('Unit tests for User', function () {
  let stub;

  before(() => {
    stub = sinon.stub(SQLManager, 'createConnectionPool');
  });

  describe('Users', function () {
    it('should throw an error if accessing the database fails', function () {
      sinon.stub(UserModel, 'getUserInfoById');
      //asyncWrap(UserController.getUserInfoById(1));
    });
    it('should throw an error if user id is missing', async () => {
      //const event = data;
      //expect(userController.getUserInfoById(data)).to.eventually.be.rejected;
    });
    it('get user id', function () {
      //
    });
    it('should successfully get user info');
  });

  describe('When adding user', function () {
    it('should throw an error if user information is incomplete');
    it('should successfully add a user');
  });

  after(() => {
    stub.restore();
  });
});

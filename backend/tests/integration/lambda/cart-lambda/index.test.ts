import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import * as data from 'tests/events/carts-lambda/get-cart-valid.json';

import { Request, Response, Result } from '/opt/core/Router';
import OrderController from '@/lambdas/orders-lambda/controller';
import { Order } from '/opt/types/order';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handler } = require('@/lambdas/carts-lambda/index');

describe('Integration tests for Orders', () => {
  const orderController = new OrderController();
  const order1: Request = {
    body: undefined,
    params: {
      orderId: 10,
    },
    query: undefined,
  };

  const order2: Request = {
    body: undefined,
    params: {
      orderId: 2,
    },
    query: undefined,
  };

  describe('Getting orders', () => {
    describe('Getting individual order', () => {
      it('should throw if user email is not a registered user', async () => {
        const event = data;
        await handler(event);
      });
    });
  });

  describe('Start an order process', () => {
    it('should throw an error if cart is empty');
    it('should throw an error if item in cart is unavailable');
  });

  describe('Process an order', () => {
    it('should throw an error if payment fails and restore products');
    it('should successfully process payment and release products');
  });

  describe('Deleting an order', () => {
    it('should throw an error if order has already shipped');
    it('should cancel order and revert payment and restore products');
  });
});

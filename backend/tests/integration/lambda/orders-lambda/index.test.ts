import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);

import * as data from 'tests/events/orders/pending_order.json';
import * as data2 from 'tests/events/orders/get_orders.json';

import { Request, Response, Result } from '/opt/core/Router';
import OrderController from "@/lambdas/orders-lambda/controller";
import { Order } from "/opt/types/order";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handler } = require('@/lambdas/orders-lambda/index');



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
        const event = data2;
        await handler(event);
      });

      it('should throw if user email is not a registered user', async () => {
        const event = data;
        await handler(event);
      });
      // it('should throw an error if order isn\'t found', async () => {
      //   const mockResponse: Response = new Response(() => null);
      //
      //   const result: Result = await orderController.getOrderById(
      //     order1,
      //     mockResponse
      //   );
      //   const order: Order = result.get();
      //   console.log(order);
      // });

      it('should return order matching order id');
      it('should return order matching order id with items');
    });

    it('should return an empty order list for user');
    it('should return a list of orders of user');
    it('should return a list of orders as an admin');
    it('should return a list of orders as an admin with filter');
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

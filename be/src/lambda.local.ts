'use strict'

import { ExpressApp } from './app';
import {
  AdminRouter,
  CartRouter,
  LoginRouter,
  OrderRouter,
  ProductRouter,
  UserRouter,
} from './routes';

const PORT = Number(process.env.PORT) || 8000;

const app = new ExpressApp([
  new AdminRouter(),
  new CartRouter(),
  new LoginRouter(),
  new OrderRouter(),
  new ProductRouter(),
  new UserRouter(),
]);
const awsServerlessExpress = require('aws-serverless-express');
const server = awsServerlessExpress.createServer(app);
app.listen(PORT);

exports.handler = (event, context) => {
  console.log('Events : ' + JSON.stringify(event));
  awsServerlessExpress.proxy(server, event, context);
}


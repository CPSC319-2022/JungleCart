#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import {
  AdminStack,
  CartsStack,
  UsersStack,
  DatabaseStack,
  AuthenticationStack,
  ProductsStack,
} from '../stacks';
import { getParsedContext } from '../lib/configuration-parser';
import { EnvironmentStackProps } from '../lib/environment-stack';
import { ServiceLambda } from '../lib/service-lambda';

const app = new cdk.App();

// configure environment
const environment = app.node.tryGetContext('env') || 'dev';
const context = getParsedContext(app, environment);
console.log(context);

// backend services
const props: EnvironmentStackProps = { environment: environment };

const dbStack = new DatabaseStack(app, 'DatabaseStack', props);
ServiceLambda.addVar('RDS_HOSTNAME', dbStack.hostname);

// services
new AuthenticationStack(app, 'AuthenticationStack', props);

new ProductsStack(app, 'ProductsStack', {
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

new CartsStack(app, 'CartsStack', {
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

new AdminStack(app, 'AdminStack', {
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

new UsersStack(app, 'UsersStack', {
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

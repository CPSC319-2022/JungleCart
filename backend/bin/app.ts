#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { DatabaseStack } from '../stacks/database-stack';
import { AuthenticationStack } from '../stacks/authentication-stack';
import { ProductsStack } from '../stacks/products-stack';
import { LayersStack } from '../stacks/layers-stack';
import { ApiStack } from '../stacks/api-stack';

import { getParsedContext } from '../lib/configuration-parser';
import { EnvironmentStackProps } from '../lib/environment-stack';
import { CartsStack, AdminStack } from '../stacks';

const app = new cdk.App();

// configure environment
const environment = app.node.tryGetContext('env') || 'dev';
const context = getParsedContext(app, environment);
console.log(context);

// backend services
const props: EnvironmentStackProps = { environment: environment };

new DatabaseStack(app, 'DatabaseStack', props);
const layersStack = new LayersStack(app, 'LayersStack', props);
const apiStack = new ApiStack(app, 'ApiStack', props);

// services
new AuthenticationStack(app, 'AuthenticationStack', props);

const productStack = new ProductsStack(app, 'ProductsStack', {
  layerConfigNames: ['SQL_LAYER'],
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

const cartStack = new CartsStack(app, 'CartsStack', {
  layerConfigNames: ['SQL_LAYER'],
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});
const adminStack = new AdminStack(app, 'AdminStack', {
  layerConfigNames: ['SQL_LAYER'],
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

// service dependencies
productStack.node.addDependency(layersStack);
productStack.node.addDependency(apiStack);
cartStack.node.addDependency(layersStack);
cartStack.node.addDependency(apiStack);
adminStack.node.addDependency(layersStack);
adminStack.node.addDependency(apiStack);

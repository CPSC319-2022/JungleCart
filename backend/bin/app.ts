#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { DatabaseStack } from '../stacks/database-stack';
import { AuthenticationStack } from '../stacks/authentication-stack';
import { ProductsStack } from '../stacks/products-stack';
import { CartsStack } from '../stacks/carts-stack';
import { AdminStack } from '../stacks/admin-stack';
import { LayersStack } from '../stacks/layers-stack';
import { ApiStack } from '../stacks/api-stack';

import { getParsedContext } from '../lib/configuration-parser';
import { EnvironmentStackProps } from '../lib/environment-stack';
import { ServiceStack } from '../lib/service-stack';
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

const layersStack = new LayersStack(app, 'LayersStack', props);
ServiceStack.setLayers(layersStack.layers);

const apiStack = new ApiStack(app, 'ApiStack', props);
ServiceStack.setApi(apiStack.api);

// services
new AuthenticationStack(app, 'AuthenticationStack', props);

new ProductsStack(app, 'ProductsStack', {
  layerConfigNames: ['SQL_LAYER'],
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

new CartsStack(app, 'CartsStack', {
  layerConfigNames: ['SQL_LAYER'],
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

new AdminStack(app, 'AdminStack', {
  layerConfigNames: ['SQL_LAYER'],
  api: true,
  lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
  environment: environment,
});

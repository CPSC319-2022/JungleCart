#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import {
    AdminStack,
    CartsStack,
    UsersStack,
    AuthenticationStack,
    ProductsStack,
} from '../stacks';
import {getParsedContext} from '../lib/configuration-parser';
import {ServiceLambda} from '../lib/service-lambda';
import {DatabaseStack} from "../stacks/database-stack";
import {ApiStack} from "../stacks/api-stack";

const app = new cdk.App();

// configure environment
const context = getParsedContext(app);
console.log(context);

const dbStack = new DatabaseStack(app, 'DatabaseStack', {});
ServiceLambda.addVar('RDS_HOSTNAME', dbStack.hostname);

// services

new ProductsStack(app, 'ProductsStack', {
    api: true,
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
});

new AuthenticationStack(app, 'AuthenticationStack', {
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
});

new CartsStack(app, 'CartsStack', {
    api: true,
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
});

new AdminStack(app, 'AdminStack', {
    api: true,
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
});

new UsersStack(app, 'UsersStack', {
    api: true,
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
});

new ApiStack(app, 'ApiStack', {});

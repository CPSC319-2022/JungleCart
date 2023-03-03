#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import {DatabaseStack} from "../stacks/database-stack";
import {AuthenticationStack} from "../stacks/authentication-stack";
import {ProductsStack} from "../stacks/products-stack";

import {getParsedContext} from "../lib/configuration-parser";
import {EnvironmentStackProps} from "../lib/environment-stack";
import {ServiceLambda} from "../lib/service-lambda";


const app = new cdk.App();

// configure environment
const environment = app.node.tryGetContext("env") || "dev";
const context = getParsedContext(app, environment);
console.log(context);

// backend services
const props: EnvironmentStackProps = {environment: environment,};

const dbStack = new DatabaseStack(app, 'DatabaseStack', props);
ServiceLambda.addVar('RDS_HOSTNAME', dbStack.hostname);

// services
new AuthenticationStack(app, 'AuthenticationStack', {
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
    environment: environment
});

new ProductsStack(app, 'ProductsStack', {
    api: true,
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
    environment: environment
});

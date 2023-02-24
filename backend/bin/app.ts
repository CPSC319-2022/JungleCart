#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import {DatabaseStack} from "../stacks/database-stack";
import {AuthenticationStack} from "../stacks/authentication-stack";
import {ProductsStack} from "../stacks/products-stack";
import {LayersStack} from "../stacks/layers-stack";
import {ApiStack} from "../stacks/api-stack";

import {configurationParser} from "../lib/configuration-parser";
import {EnvironmentStackProps} from "../lib/environment-stack";

const app = new cdk.App();

// configure environment
const environment = app.node.tryGetContext("env") || "dev";
const environmentConfiguration = configurationParser(app.node.tryGetContext(environment));
console.log(environmentConfiguration);

// backend services
const props: EnvironmentStackProps = {environment: environment,};

new DatabaseStack(app, 'DatabaseStack', props);
const layersStack = new LayersStack(app, 'LayersStack', props);
const apiStack = new ApiStack(app, 'ApiStack', props);

// services
new AuthenticationStack(app, 'AuthenticationStack', props);

const productStack = new ProductsStack(app, 'ProductsStack', {
    layerConfigNames: ['SQL_LAYER'],
    api: true,
    lambdaEnvironmentConfigNames: ['DB_ENVIRONMENT'],
    environment: environment
});

// service dependencies
productStack.node.addDependency(layersStack);
productStack.node.addDependency(apiStack);

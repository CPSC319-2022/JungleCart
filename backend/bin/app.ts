#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {DatabaseStack} from "../stacks/database-stack";
import {AuthenticationStack} from "../stacks/authentication-stack";
import {ProductsStack} from "../stacks/products-stack";
import {LayersStack} from "../stacks/layers-stack";
import {ApiStack} from "../stacks/api-stack";
import {configurationParser} from "../lib/configuration-parser";

const app = new cdk.App();

// configure environment
const environment = app.node.tryGetContext("env") || "dev";
const environmentConfiguration = app.node.tryGetContext(environment);
configurationParser(environmentConfiguration);
console.log(environmentConfiguration);

// backend services
const dbEnvironment = {
    'RDS_NAME': 'sqlDB',
    'RDS_USERNAME': 'admin',
    'RDS_PASSWORD': 'password',
    'RDS_PORT': '3306',
};

const sqlLayerArnParameterName = 'sqlLayerArnParameterName';

new DatabaseStack(app, 'DatabaseStack', {
    environment: environment,
});

dbEnvironment['RDS_HOSTNAME'] = cdk.Fn.importValue('databaseEndpoint');

const layersStack = new LayersStack(app, 'LayersStack', {
    environment: environment
});
const apiStack = new ApiStack(app, 'ApiStack', {
    environment: environment
});


// services
new AuthenticationStack(app, 'AuthenticationStack', {
    environment: environment
});

const restApiId = cdk.Fn.importValue('restApiId');
const rootResourceId = cdk.Fn.importValue('rootResourceId');

const productStack = new ProductsStack(app, 'ProductsStack', {
    layerArns: [sqlLayerArnParameterName],
    restApiId: restApiId,
    rootResourceId: rootResourceId,
    db_environment: dbEnvironment,
    environment: environment
});

// service dependencies
productStack.node.addDependency(layersStack);
productStack.node.addDependency(apiStack);

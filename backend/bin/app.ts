#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {DatabaseStack} from "../stacks/database-stack";
import {AuthenticationStack} from "../stacks/authetication-stack";
import {ProductsStack} from "../stacks/products-stack";
import {LayersStack} from "../stacks/layers-stack";
import {ApiStack} from "../stacks/api-stack";

const app = new cdk.App();

const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
};



// backend services
const dbEnvironment = {
    'RDS_NAME': 'sqlDB',
    'RDS_USERNAME': 'admin',
    'RDS_PASSWORD': 'password',
    'RDS_PORT': '3306',
};

new DatabaseStack(app, 'DatabaseStack', {
    env: env,
    dbConstructProps: dbEnvironment,
});

const layersStack = new LayersStack(app, 'LayersStack', {env: env});
const apiStack = new ApiStack(app, 'ApiStack', {env: env});



// services
new AuthenticationStack(app, 'AuthenticationStack', {env: env});

dbEnvironment['RDS_HOSTNAME'] = cdk.Fn.importValue('databaseEndpoint');
const sqlLayerArn = cdk.Fn.importValue('sqlLayerArn');
const restApiId = cdk.Fn.importValue('restApiId');
const rootResourceId = cdk.Fn.importValue('rootResourceId');
const productStack = new ProductsStack(app, 'ProductsStack', {
    layerArns: [["ProductsSqlLayer", sqlLayerArn]],
    restApiId: restApiId,
    rootResourceId: rootResourceId,
    environment: dbEnvironment,
    env: env
});

// service dependencies
productStack.addDependency(layersStack);
productStack.addDependency(apiStack);

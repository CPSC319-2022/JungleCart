#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import {ProductsStack} from '../lib/products-stack';
import {DatabaseStack} from "../lib/database-stack";
import {VpcStack} from "../lib/vpc-stack";

const app = new cdk.App();

const vpc_stack = new VpcStack(app, 'VpcStack', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});

const vpc = vpc_stack.vpc;

const db_stack = new DatabaseStack(app, 'DatabaseStack', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
    vpc: vpc,
});

new ProductsStack(app, 'ProductsStack', {
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
    vpc: vpc,
    hostname: db_stack.hostname,
    port: '3306',
    username: 'admin',
    password: 'password',
});
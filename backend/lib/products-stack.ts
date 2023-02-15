import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as api_gw from 'aws-cdk-lib/aws-apigateway';

import {Construct} from 'constructs';

import {ProductsStackProps} from "./stack-props";

export class ProductsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const get_products_lambda = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'get-products-lambda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            entry: 'lambda/get-products-lambda.js',
            handler: 'handler',
            vpc: props.vpc,
            allowPublicSubnet: true,
            bundling: {
                nodeModules: ['mysql',],
            },
        });

        get_products_lambda.addEnvironment('RDS_LAMBDA_HOSTNAME', props.hostname);
        get_products_lambda.addEnvironment('RDS_LAMBDA_PORT', props.port);
        get_products_lambda.addEnvironment('RDS_LAMBDA_USERNAME', props.username);
        get_products_lambda.addEnvironment('RDS_LAMBDA_PASSWORD', props.password);

        const get_products_lambda_api = new api_gw.LambdaRestApi(this, 'get-lambda-products-endpoint', {
            description: 'get api for products lambda func',
            handler: get_products_lambda,
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://localhost:3000'],
                allowMethods: ['GET'],
            },
            proxy: false,
        });

        new cdk.CfnOutput(this, 'get-products-lambda-api-url', {value: get_products_lambda_api.url});

        const products_resource = get_products_lambda_api.root.addResource('products');

        products_resource.addMethod(
            'GET',
            new api_gw.LambdaIntegration(get_products_lambda),
        );
    }
}

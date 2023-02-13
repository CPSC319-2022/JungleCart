import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as api_gw from 'aws-cdk-lib/aws-apigateway';

import { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const get_products_lambda = new lambda.Function(this, 'get-products-lambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'get-products-lambda.handler',
    });

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

import {Construct} from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';

import {ServiceLambda} from "../lib/service-lambda";
import * as api_gw from "aws-cdk-lib/aws-apigateway";

export interface ProductsStackProps extends cdk.StackProps {
    readonly restApiId: string;
    readonly rootResourceId: string;
    readonly layerArns: [[id: string, arn: string]];
    readonly environment: { [key: string]: string };
}

export class ProductsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const layers = props.layerArns.map(([id, arn]) => {
            return lambda.LayerVersion.fromLayerVersionArn(this, id, arn);
        });

        const products_lambda = new ServiceLambda(this, 'ProductLambda', {
            filename: 'products-lambda',
            layers: layers,
            environment: props.environment,
        });

        const api_gateway = apiGateway.RestApi.fromRestApiAttributes(this, 'ProductsApiGateway', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });

        const lambda_integration = new api_gw.LambdaIntegration(products_lambda);

        // /products
        const products_resource = api_gateway.root.addResource('products');
        products_resource.addMethod('GET', lambda_integration);
        products_resource.addMethod('POST', lambda_integration);

        // /products/:productId
        const products_productId_resource = api_gateway.root.addResource(':productId');
        products_productId_resource.addMethod('DELETE', lambda_integration);
        products_productId_resource.addMethod('GET', lambda_integration);
        products_productId_resource.addMethod('POST', lambda_integration);
    }
}

import {Construct} from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";

import {ServiceLambda} from "../lib/service-lambda";
import {ApiConstruct} from "../lib/api-construct";

export interface ProductsStackProps extends cdk.StackProps {
    readonly api: ApiConstruct;
    readonly layers: lambda.ILayerVersion[];
    readonly environment: { [key: string]: string };
}

export class ProductsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const products_lambda = new ServiceLambda(this, 'ProductLambda', {
            filename: 'products-lambda',
            layers: props.layers,
            environment: props.environment,
        });

        // /products
        const products_path = props.api.registerMethod(
            'products',
            ['GET', 'POST'],
            products_lambda
        );

        // /products/:productId
        props.api.registerMethod(
            ':productId',
            ['DELETE', 'GET', 'PUT'],
            products_lambda,
            products_path
        );
    }
}

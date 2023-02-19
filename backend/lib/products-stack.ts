import {Construct} from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";

import {LambdaConstruct} from "../constructs/lambda-construct";
import {ApiConstruct} from "../constructs/api-construct";

export interface ProductsStackProps extends cdk.NestedStackProps {
    readonly api: ApiConstruct;
    readonly layers: lambda.ILayerVersion[];
    readonly environment: { [key: string]: string };
}

export class ProductsStack extends cdk.NestedStack  {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const get_products_lambda = new LambdaConstruct(this, 'GetProductLambda', {
            filename: 'get-products-lambda',
            layers: props.layers,
            environment: props.environment,
        });

        props.api.registerLambda('products', 'GET', get_products_lambda);
    }
}

import * as cdk from 'aws-cdk-lib';

import {Construct} from 'constructs';

import {ProductsStackProps} from "../props/products-stack-props";
import {LambdaConstruct} from "../constructs/lambda-construct";

export class ProductsStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const get_products_lambda = new LambdaConstruct(this, 'getProductLambda', {
            filename: 'get-products-lambda',
            layers: props.layers,
        });

        props.api.registerLambda('products', 'GET', get_products_lambda);
    }
}

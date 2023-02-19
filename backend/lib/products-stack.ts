import {Construct} from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as lambda from "aws-cdk-lib/aws-lambda";

import {ServiceLambda} from "../constructs/service-lambda";
import {ApiConstruct} from "../constructs/api-construct";

export interface ProductsStackProps extends cdk.NestedStackProps {
    readonly api: ApiConstruct;
    readonly layers: lambda.ILayerVersion[];
    readonly environment: { [key: string]: string };
}

export class ProductsStack extends cdk.NestedStack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const products_lambda = new ServiceLambda(this, 'ProductLambda', {
            filename: 'products-lambda',
            layers: props.layers,
            environment: props.environment,
        });

        props.api.registerMethod(
            'products',
            ['GET', 'POST', 'PUT'],
            products_lambda
        );
    }
}

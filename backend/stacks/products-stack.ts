import {Construct} from 'constructs';

import {ServiceLambda} from "../lib/service-lambda";
import {ServiceStack, ServiceStackProps} from "../lib/service-stack";

export interface ProductsStackProps extends ServiceStackProps {
    readonly db_environment: { [key: string]: string };
}

export class ProductsStack extends ServiceStack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        const products_lambda = new ServiceLambda(this, 'ProductLambda', {
            filename: 'products-lambda',
            layers: this.layers,
            environment: props.db_environment,
        });

        this.addHttpMethod('products', ['GET', 'POST'], products_lambda);
        this.addHttpMethod('products/:productId', ['DELETE', 'GET', 'POST'], products_lambda);
    }
}

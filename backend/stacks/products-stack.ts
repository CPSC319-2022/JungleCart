import {Construct} from 'constructs';

import {ServiceLambda} from "../lib/service-lambda";
import {ServiceStack, ServiceStackProps} from "../lib/service-stack";

export type ProductsStackProps = ServiceStackProps

export class ProductsStack extends ServiceStack {
    constructor(scope: Construct, id: string, props: ProductsStackProps) {
        super(scope, id, props);

        // the id refers to the config which is found in config/services.json
        // if you also want to use the config, just set your stack id as an object in that file like this one is
        // otherwise, you can just set it to some string
        const products_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
            filename: 'products-lambda',
            // you can also just use this.getLayers() which will return all layers
            layers: this.getLayers('SQL_LAYER'),
            // if you want to add more values use {...this.lambda_environment, "YOUR_VAR_NAME": "YOUR_VAR_VALUE" }
            environment: this.lambda_environment,
        });

        this.addHttpMethod('products', ['GET', 'POST'], products_lambda);
        this.addHttpMethod('products/:productId', ['DELETE', 'GET', 'POST'], products_lambda);
    }
}

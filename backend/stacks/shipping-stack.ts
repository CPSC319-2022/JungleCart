import {Construct} from 'constructs';
import {ServiceLambda} from "../lib/service-lambda";
import {ServiceStack, ServiceStackProps} from "../lib/service-stack";

export type ShippingStackProps = ServiceStackProps;

export class ShippingStack extends ServiceStack {
    constructor(scope: Construct, id: string, props: ShippingStackProps) {
        super(scope, id, props);

        // this.createLayer('SQL_LAYER');

        // the id refers to the config which is found in config/services.json
        // you will need to do the same for your service stacks
        // look at the ProductsStack config for ideas on how to use it yourself
        const shipping_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
            dir: 'shipping-lambda',
            // you can also just use this.getLayers() which will return all layers
            // the layers that you can get are added when you initialize the stack in src/app.ts
            layers: this.getLayers('SQL_LAYER'),
            // if you want to add more values use {...this.lambda_environment, "YOUR_VAR_NAME": "YOUR_VAR_VALUE" }
            // you can also create your own environment in the config/lambda.json
            // and simply pass the environment name when you initialize the stack in src/app.ts
            environment: this.lambda_environment,
        });
    }
}

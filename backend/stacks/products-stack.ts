import { Construct } from 'constructs';

import { ServiceLambda } from '../lib/service-lambda';
import { ServiceStack, ServiceStackProps } from '../lib/service-stack';

export type ProductsStackProps = ServiceStackProps;

export class ProductsStack extends ServiceStack {
  constructor(scope: Construct, id: string, props: ProductsStackProps) {
    super(scope, id, props);

    // the id refers to the config which is found in config/services.json
    // you will need to do the same for your service stacks
    // look at the ProductsStack config for ideas on how to use it yourself
    const products_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
      dir: 'products-lambda',
      // you can also just use this.getLayers() which will return all layers
      layers: this.getLayers(),
      // if you want to add more values use {...this.lambda_environment, "YOUR_VAR_NAME": "YOUR_VAR_VALUE" }
      // you can also create your own environment in the config/lambda-environment.json
      // and simply pass the environment name when you initialize the stack in src/app.ts
      environment: this.lambda_environment,
    });

    this.addHttpMethod('products', ['GET', 'POST'], products_lambda);
    this.addHttpMethod(
      'products/:productId',
      ['DELETE', 'GET', 'POST'],
      products_lambda
    );
  }
}

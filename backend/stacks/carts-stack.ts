import { Construct } from 'constructs';
import { ServiceLambda } from '../lib/service-lambda';
import { ServiceStack, ServiceStackProps } from '../lib/service-stack';

export type CartsStackProps = ServiceStackProps;

export class CartsStack extends ServiceStack {
  constructor(scope: Construct, id: string, props: CartsStackProps) {
    super(scope, id, props);
    this.createLayer('SQL_LAYER');
    const carts_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
      dir: 'carts-lambda',
      layers: this.getLayers('SQL_LAYER'),
      environment: this.lambda_environment,
    });

    // /carts/:userId/items
    this.addHttpMethod(
      'carts/{userId}/items',
      ['GET', 'PUT', 'POST'],
      carts_lambda
    );

    // /carts/:userId/items/:id
    this.addHttpMethod('carts/{userId}/items/{id}', ['DELETE'], carts_lambda);
  }
}

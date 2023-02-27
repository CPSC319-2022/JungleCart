import { Construct } from 'constructs';

import { ServiceLambda } from '../lib/service-lambda';
import { ServiceStack, ServiceStackProps } from '../lib/service-stack';

export type UsersStackProps = ServiceStackProps;

export class UsersStack extends ServiceStack {
  constructor(scope: Construct, id: string, props: UsersStackProps) {
    super(scope, id, props);
    const users_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
      filename: 'users-lambda',
      layers: this.getLayers('SQL_LAYER'),
      environment: this.lambda_environment,
    });

    this.addHttpMethod('users', ['GET', 'POST'], users_lambda);
    this.addHttpMethod(
      'users/{userId}',
      ['DELETE', 'GET', 'POST'],
      users_lambda
    );
    this.addHttpMethod(
      'users/{userId}/addresses',
      ['GET', 'POST'],
      users_lambda
    );
    this.addHttpMethod(
      'users/{userId}/addresses/{addressId}',
      ['GET', 'DELETE', 'PUT'],
      users_lambda
    );
  }
}
import { Construct } from 'constructs';

import { ServiceLambda } from '../lib/service-lambda';
import { ServiceStack, ServiceStackProps } from '../lib/service-stack';

export type UsersStackProps = ServiceStackProps;

export class UsersStack extends ServiceStack {
  constructor(scope: Construct, id: string, props: UsersStackProps) {
    super(scope, id, props);

    // the id refers to the config which is found in config/services.json
    // you will need to do the same for your service stacks
    // look at the UsersStack config for ideas on how to use it yourself
    const users_lambda = new ServiceLambda(this, this.config.LAMBDA_ID, {
      filename: 'users-lambda',
      // you can also just use this.getLayers() which will return all layers
      // the layers that you can get are added when you initialize the stack in src/app.ts
      layers: this.getLayers('SQL_LAYER'),
      // if you want to add more values use {...this.lambda_environment, "YOUR_VAR_NAME": "YOUR_VAR_VALUE" }
      // you can also create your own environment in the config/lambda.json
      // and simply pass the environment name when you initialize the stack in src/app.ts
      environment: this.lambda_environment,
    });

    this.addHttpMethod('users', ['GET', 'POST'], users_lambda);
    this.addHttpMethod(
      'users/:userIId',
      ['DELETE', 'GET', 'POST'],
      users_lambda
    );
    this.addHttpMethod(
      'users/:userId/addresses',
      ['GET', 'POST'],
      users_lambda
    );
    this.addHttpMethod(
      'users/:userId/addresses/:addressId',
      ['GET', 'DELETE', 'PUT'],
      users_lambda
    );
  }
}

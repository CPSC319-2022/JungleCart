import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { EnvironmentStack } from '../../lib/environment-stack';

export default class ApiStack extends EnvironmentStack {
  private readonly _api;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this._api = new apigateway.RestApi(this, 'API', {
      description: 'Jungle Cart API',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });
  }

  public api() {
    return this._api;
  }
}

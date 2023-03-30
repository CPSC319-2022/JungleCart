import { Construct } from 'constructs';

import * as cdk from 'aws-cdk-lib';

export class EnvironmentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(
      scope,
      id,
      props.env
        ? props
        : {
            ...props,
            env: scope.node.tryGetContext(scope.node.tryGetContext('env'))[
              'env-config'
            ],
          }
    );
  }
}
